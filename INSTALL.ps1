# Instala ou atualiza o tabularium no repositório git do diretório atual (a raiz).
#
#   irm https://raw.githubusercontent.com/useful-toys/Tabularium/main/INSTALL.ps1 | iex
#
# Variáveis de ambiente opcionais:
#   $env:TABULARIUM_VERSION = 'v1.2.0'       tag a instalar (padrão: a última vX.Y.Z)
#   $env:TABULARIUM_SOURCE = '<url git>'     repositório de origem (padrão: o do .tabularium, ou o oficial)
#   $env:TABULARIUM_ALLOW_DOWNGRADE = '1'    permite instalar tag menor que a instalada
#
# Apaga os arquivos que saíram do manifesto; copia os de tabularium.manifest da tag, sobrescrevendo;
# troca só o bloco do tabularium no AGENTS.md; grava origem, tag e arquivos em .tabularium.
# Não faz commit: revise o diff, rode /spec-init e abra um PR.
# Feito para rodar via irm | iex; salvo em arquivo no Windows PowerShell 5.1, os acentos só saem certos com BOM.
# Mesma lógica em INSTALL.sh: mude os dois juntos.

& {
  $ErrorActionPreference = 'Stop'
  $DefaultSource = 'https://github.com/useful-toys/Tabularium.git'
  $Begin = '<!-- tabularium:begin -->'
  $End = '<!-- tabularium:end -->'
  $SemVer = '^v[0-9]+\.[0-9]+\.[0-9]+$'
  $Utf8 = New-Object System.Text.UTF8Encoding($false)
  $Root = (Get-Location).Path

  function Fail($msg) { throw "tabularium: $msg" }
  # Comando git sem transformar stderr em exceção (Windows PowerShell 5.1).
  function RunGit {
    $prev = $ErrorActionPreference; $ErrorActionPreference = 'Continue'
    try { $out = & git @args 2>$null; [pscustomobject]@{ Out = @($out); Ok = ($LASTEXITCODE -eq 0) } }
    finally { $ErrorActionPreference = $prev }
  }
  function Full($path) { Join-Path $Root $path }
  function ReadText($path) { [System.IO.File]::ReadAllText($path, $Utf8) }
  function Lines($text) { @(($text -replace "`r", '') -split "`n") }
  function WriteText($path, $text) { [System.IO.File]::WriteAllText((Full $path), $text, $Utf8) }
  function Version($v) { [version]($v.Substring(1)) }
  # Caminho relativo dentro do repositório: sem absoluto, sem unidade e sem "..".
  function SafePath($p) {
    if (-not $p -or $p -match '^[/\\]' -or $p -match '^[A-Za-z]:' -or $p -match '(^|[/\\])\.\.([/\\]|$)') { Fail "caminho inválido: $p" }
  }
  # Índices do único BEGIN e do único END depois dele; $null se não houver marcadores; falha se malformado.
  function Markers($lines, $what) {
    $b = @(); $e = @()
    for ($i = 0; $i -lt $lines.Count; $i++) {
      if ($lines[$i] -ceq $Begin) { $b += $i } elseif ($lines[$i] -ceq $End) { $e += $i }
    }
    if ($b.Count -eq 0 -and $e.Count -eq 0) { return $null }
    if ($b.Count -ne 1 -or $e.Count -ne 1 -or $e[0] -lt $b[0]) {
      Fail "$what precisa de exatamente um $Begin seguido de um $End; corrija à mão"
    }
    , @($b[0], $e[0])
  }

  if (-not (Get-Command git -ErrorAction SilentlyContinue)) { Fail 'git não encontrado' }
  $r = RunGit rev-parse --show-prefix
  if (-not $r.Ok) { Fail 'rode dentro de um repositório git' }
  if (($r.Out -join '').Trim()) { Fail "rode na raiz do repositório: $((RunGit rev-parse --show-toplevel).Out)" }
  if (Test-Path -LiteralPath (Full 'tabularium-spec')) { Fail 'este é o repositório do próprio tabularium; não se instala nele' }

  foreach ($f in 'CLAUDE.md', 'spec/CLAUDE.md') {
    if (Test-Path -LiteralPath (Full $f)) {
      Fail "$f encontrado. O tabularium só trabalha com AGENTS.md, e o Claude Code ignora o AGENTS.md quando existe CLAUDE.md. Migre o conteúdo de $f para AGENTS.md manualmente, apague $f e rode de novo."
    }
  }

  # Instalação anterior.
  $oldVersion = ''; $oldSource = ''; $oldFiles = @()
  if (Test-Path -LiteralPath (Full '.tabularium')) {
    foreach ($l in Lines (ReadText (Full '.tabularium'))) {
      if ($l -like 'version=*') { $oldVersion = $l.Substring(8) }
      elseif ($l -like 'source=*') { $oldSource = $l.Substring(7) }
      elseif ($l -like 'file=*') { $oldFiles += $l.Substring(5) }
    }
    if ($oldVersion -notmatch $SemVer) { Fail ".tabularium com versão inválida: $oldVersion" }
  }
  $source = $env:TABULARIUM_SOURCE
  if (-not $source) { $source = $oldSource }
  if (-not $source) { $source = $DefaultSource }

  # Versão alvo.
  $version = $env:TABULARIUM_VERSION
  if (-not $version) {
    $refs = RunGit ls-remote --tags --refs $source
    if (-not $refs.Ok) { Fail "não foi possível consultar $source" }
    $version = $refs.Out | ForEach-Object { $_ -replace '.*refs/tags/', '' } | Where-Object { $_ -match $SemVer } |
      Sort-Object { Version $_ } | Select-Object -Last 1
    if (-not $version) { Fail "nenhuma versão vX.Y.Z publicada em $source" }
  }
  if ($version -notmatch $SemVer) { Fail "versão inválida: $version (use vX.Y.Z)" }
  if ($oldVersion -and (Version $version) -lt (Version $oldVersion) -and $env:TABULARIUM_ALLOW_DOWNGRADE -ne '1') {
    Fail "$version é menor que a instalada ($oldVersion); use `$env:TABULARIUM_ALLOW_DOWNGRADE = '1' para voltar"
  }

  $tmp = Join-Path ([System.IO.Path]::GetTempPath()) ('tabularium-' + [guid]::NewGuid())
  try {
    $src = Join-Path $tmp 'src'
    if (-not (RunGit -c advice.detachedHead=false clone --quiet --depth 1 --branch $version $source $src).Ok) {
      Fail "não foi possível baixar $version de $source"
    }
    $manifest = Join-Path $src 'tabularium.manifest'
    if (-not (Test-Path -LiteralPath $manifest)) { Fail "$version não tem tabularium.manifest" }

    $files = @(Lines (ReadText $manifest) | Where-Object { $_.Trim() -and $_ -notmatch '^#' })
    foreach ($f in $files) {
      SafePath $f
      if (-not (Test-Path -LiteralPath (Join-Path $src $f) -PathType Leaf)) { Fail "arquivo do manifesto ausente em ${version}: $f" }
    }
    foreach ($f in $oldFiles) { SafePath $f }

    # Bloco do AGENTS.md da versão, e validação do AGENTS.md do projeto antes de mexer em qualquer coisa.
    $srcAgents = Lines (ReadText (Join-Path $src 'AGENTS.md'))
    $m = Markers $srcAgents "AGENTS.md de $version"
    if (-not $m) { Fail "$version sem bloco do tabularium no AGENTS.md" }
    $block = $srcAgents[$m[0]..$m[1]]
    $agentsPath = Full 'AGENTS.md'
    $hasAgents = Test-Path -LiteralPath $agentsPath
    if ($hasAgents) {
      $agentsText = ReadText $agentsPath
      $nl = if ($agentsText -match "`r`n") { "`r`n" } else { "`n" }
      $cur = Lines $agentsText
      $trailing = $cur.Count -gt 0 -and $cur[-1] -eq ''
      if ($trailing) { $cur = @($cur | Select-Object -SkipLast 1) }
      $cm = Markers $cur 'AGENTS.md'
    }

    # Apaga o que saiu do manifesto (antes de copiar, para não apagar uma renomeação só de caixa).
    foreach ($f in $oldFiles) {
      if ($files -cnotcontains $f -and (Test-Path -LiteralPath (Full $f))) {
        Remove-Item -LiteralPath (Full $f) -Force
        $dir = Split-Path $f -Parent
        while ($dir -and (Test-Path -LiteralPath (Full $dir)) -and -not (Get-ChildItem -LiteralPath (Full $dir) -Force)) {
          Remove-Item -LiteralPath (Full $dir) -Force
          $dir = Split-Path $dir -Parent
        }
        Write-Host "apagado: $f"
      }
    }

    # Copia o manifesto, sobrescrevendo.
    foreach ($f in $files) {
      $dir = Split-Path $f -Parent
      if ($dir) { New-Item -ItemType Directory -Force -Path (Full $dir) | Out-Null }
      Copy-Item -LiteralPath (Join-Path $src $f) -Destination (Full $f) -Force
    }

    # Troca o bloco no AGENTS.md, preservando o resto e o fim de linha do arquivo.
    if (-not $hasAgents) {
      WriteText 'AGENTS.md' (($block -join "`n") + "`n")
    } else {
      if ($cm) {
        $before = if ($cm[0] -gt 0) { $cur[0..($cm[0] - 1)] } else { @() }
        $after = if ($cm[1] -lt $cur.Count - 1) { $cur[($cm[1] + 1)..($cur.Count - 1)] } else { @() }
        $out = @($before) + @($block) + @($after)
      } else {
        $out = @($block) + @('') + @($cur)
      }
      $text = $out -join $nl
      if ($trailing -or -not $cm) { $text += $nl }
      WriteText 'AGENTS.md' $text
    }

    # Registro da instalação.
    $record = @('# Gerado pelo INSTALL do tabularium. Não edite à mão.', "source=$source", "version=$version")
    $record += $files | ForEach-Object { "file=$_" }
    WriteText '.tabularium' (($record -join "`n") + "`n")
  } finally {
    if (Test-Path -LiteralPath $tmp) { Remove-Item -LiteralPath $tmp -Recurse -Force }
  }

  $shown = if ($oldVersion) { $oldVersion } else { '(nenhum)' }
  Write-Host "tabularium $shown -> $version"
  if ($oldVersion -and (Version $oldVersion).Major -ne (Version $version).Major) {
    Write-Host 'Versão maior diferente: o formato da spec pode ter mudado. Rode /spec-init para adaptar a spec no mesmo PR.'
  } else {
    Write-Host 'Rode /spec-init para configurar ou conferir a spec.'
  }
  Write-Host 'Revise o diff e abra um PR.'
}
