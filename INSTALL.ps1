# Instala ou atualiza o tabularium no repositório git do diretório atual (a raiz).
#
#   irm https://raw.githubusercontent.com/useful-toys/Tabularium/main/INSTALL.ps1 | iex
#
# Variáveis de ambiente opcionais:
#   $env:TABULARIUM_VERSION = 'v1.2.0'       tag a instalar (padrão: a última)
#   $env:TABULARIUM_SOURCE = '<url git>'     repositório de origem (padrão: o do .tabularium, ou o oficial)
#   $env:TABULARIUM_ALLOW_DOWNGRADE = '1'    permite instalar tag menor que a instalada
#
# Copia os arquivos de tabularium.manifest da tag, sobrescrevendo; apaga os que saíram do manifesto;
# troca só o bloco do tabularium no AGENTS.md; grava origem, tag e arquivos em .tabularium.
# Não faz commit: revise o diff, rode /spec-init e abra um PR.
# Mesma lógica em INSTALL.sh: mude os dois juntos.

& {
  $ErrorActionPreference = 'Stop'
  $DefaultSource = 'https://github.com/useful-toys/Tabularium.git'
  $Begin = '<!-- tabularium:begin -->'
  $End = '<!-- tabularium:end -->'
  $Utf8 = New-Object System.Text.UTF8Encoding($false)

  function Fail($msg) { throw "tabularium: $msg" }
  function WriteLines($path, $lines) {
    [System.IO.File]::WriteAllText((Join-Path (Get-Location) $path), (($lines -join "`n") + "`n"), $Utf8)
  }
  function ReadLines($path) {
    ([System.IO.File]::ReadAllText($path, $Utf8) -replace "`r", '') -split "`n" | Where-Object { $_ -ne $null }
  }
  function ParseVersion($v) { [version](($v -replace '^v', '') -replace '[^0-9.].*$', '') }

  if (-not (Get-Command git -ErrorAction SilentlyContinue)) { Fail 'git não encontrado' }
  $top = git rev-parse --show-toplevel 2>$null
  if ($LASTEXITCODE -ne 0) { Fail 'rode dentro de um repositório git' }
  if ((Resolve-Path $top).Path -ne (Get-Location).Path) { Fail "rode na raiz do repositório: $top" }
  if (Test-Path tabularium-spec) { Fail 'este é o repositório do próprio tabularium; não se instala nele' }

  foreach ($f in 'CLAUDE.md', 'spec/CLAUDE.md') {
    if (Test-Path $f) {
      Fail "$f encontrado. O tabularium só trabalha com AGENTS.md, e o Claude Code ignora o AGENTS.md quando existe CLAUDE.md. Migre o conteúdo de $f para AGENTS.md manualmente, apague $f e rode de novo."
    }
  }

  # Instalação anterior.
  $oldVersion = ''; $oldSource = ''; $oldFiles = @()
  if (Test-Path .tabularium) {
    foreach ($l in ReadLines (Resolve-Path .tabularium).Path) {
      if ($l -like 'version=*') { $oldVersion = $l.Substring(8) }
      elseif ($l -like 'source=*') { $oldSource = $l.Substring(7) }
      elseif ($l -like 'file=*') { $oldFiles += $l.Substring(5) }
    }
  }
  $source = $env:TABULARIUM_SOURCE
  if (-not $source) { $source = $oldSource }
  if (-not $source) { $source = $DefaultSource }

  # Versão alvo.
  $version = $env:TABULARIUM_VERSION
  if (-not $version) {
    $version = git ls-remote --tags --refs --sort=-v:refname $source 'v*' |
      Select-Object -First 1 | ForEach-Object { $_ -replace '.*refs/tags/', '' }
    if (-not $version) { Fail "nenhuma versão publicada em $source" }
  }
  if ($oldVersion -and $oldVersion -ne $version -and (ParseVersion $version) -lt (ParseVersion $oldVersion) -and
      $env:TABULARIUM_ALLOW_DOWNGRADE -ne '1') {
    Fail "$version é menor que a instalada ($oldVersion); use `$env:TABULARIUM_ALLOW_DOWNGRADE = '1' para voltar"
  }

  $tmp = Join-Path ([System.IO.Path]::GetTempPath()) ('tabularium-' + [guid]::NewGuid())
  try {
    git -c advice.detachedHead=false clone --quiet --depth 1 --branch $version $source "$tmp/src"
    if ($LASTEXITCODE -ne 0) { Fail "não foi possível baixar $version de $source" }
    if (-not (Test-Path "$tmp/src/tabularium.manifest")) { Fail "$version não tem tabularium.manifest" }

    $files = @(ReadLines "$tmp/src/tabularium.manifest" | Where-Object { $_ -and $_ -notmatch '^#' -and $_.Trim() })

    # Copia o manifesto, sobrescrevendo.
    foreach ($f in $files) {
      if (-not (Test-Path "$tmp/src/$f" -PathType Leaf)) { Fail "arquivo do manifesto ausente em ${version}: $f" }
      $dir = Split-Path $f -Parent
      if ($dir) { New-Item -ItemType Directory -Force $dir | Out-Null }
      Copy-Item "$tmp/src/$f" $f -Force
    }

    # Apaga o que saiu do manifesto.
    foreach ($f in $oldFiles) {
      if ($files -notcontains $f -and (Test-Path $f)) {
        Remove-Item $f -Force
        $dir = Split-Path $f -Parent
        while ($dir -and (Test-Path $dir) -and -not (Get-ChildItem -Force $dir)) {
          Remove-Item $dir -Force
          $dir = Split-Path $dir -Parent
        }
        Write-Host "apagado: $f"
      }
    }

    # Bloco do AGENTS.md.
    $src = ReadLines "$tmp/src/AGENTS.md"
    $b = [array]::IndexOf($src, $Begin); $e = [array]::IndexOf($src, $End)
    if ($b -lt 0 -or $e -lt $b) { Fail "$version sem bloco do tabularium no AGENTS.md" }
    $block = $src[$b..$e]
    if (-not (Test-Path AGENTS.md)) {
      WriteLines AGENTS.md $block
    } else {
      $cur = @(ReadLines (Resolve-Path AGENTS.md).Path)
      if ($cur[-1] -eq '') { $cur = @($cur | Select-Object -SkipLast 1) }
      $cb = [array]::IndexOf($cur, $Begin); $ce = [array]::IndexOf($cur, $End)
      if ($cb -ge 0) {
        if ($ce -lt $cb) { Fail "AGENTS.md tem $Begin sem $End; corrija à mão" }
        $before = if ($cb -gt 0) { $cur[0..($cb - 1)] } else { @() }
        $after = if ($ce -lt $cur.Count - 1) { $cur[($ce + 1)..($cur.Count - 1)] } else { @() }
        WriteLines AGENTS.md (@($before) + @($block) + @($after))
      } else {
        WriteLines AGENTS.md (@($block) + @('') + $cur)
      }
    }

    # Registro da instalação.
    $record = @('# Gerado pelo INSTALL do tabularium. Não edite à mão.', "source=$source", "version=$version")
    $record += $files | ForEach-Object { "file=$_" }
    WriteLines .tabularium $record
  } finally {
    if (Test-Path $tmp) { Remove-Item $tmp -Recurse -Force }
  }

  $shown = if ($oldVersion) { $oldVersion } else { '(nenhum)' }
  Write-Host "tabularium $shown -> $version"
  if ($oldVersion -and (ParseVersion $oldVersion).Major -ne (ParseVersion $version).Major) {
    Write-Host 'Versão major: o formato da spec mudou. Rode /spec-init para adaptar a spec no mesmo PR.'
  } else {
    Write-Host 'Rode /spec-init para configurar ou conferir a spec.'
  }
  Write-Host 'Revise o diff e abra um PR.'
}
