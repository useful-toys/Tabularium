#!/bin/sh
# Instala ou atualiza o tabularium no repositório git do diretório atual (a raiz).
#
#   curl -fsSL https://raw.githubusercontent.com/useful-toys/Tabularium/main/INSTALL.sh | sh
#
# Variáveis opcionais:
#   TABULARIUM_VERSION=v1.2.0        tag a instalar (padrão: a última vX.Y.Z)
#   TABULARIUM_SOURCE=<url git>      repositório de origem (padrão: o do .tabularium, ou o oficial)
#   TABULARIUM_ALLOW_DOWNGRADE=1     permite instalar tag menor que a instalada
#
# Apaga os arquivos que saíram do manifesto; copia os de tabularium.manifest da tag, sobrescrevendo;
# troca só o bloco do tabularium no AGENTS.md; grava origem, tag e arquivos em .tabularium.
# Não faz commit: revise o diff, rode /spec-init e abra um PR.
# Mesma lógica em INSTALL.ps1: mude os dois juntos.
set -euf

DEFAULT_SOURCE="https://github.com/useful-toys/Tabularium.git"
BEGIN="<!-- tabularium:begin -->"
END="<!-- tabularium:end -->"
SEMVER='^v[0-9]+\.[0-9]+\.[0-9]+$'

die() { echo "tabularium: $*" >&2; exit 1; }
is_semver() { printf '%s\n' "$1" | grep -Eq "$SEMVER"; }
# Caminho relativo dentro do repositório: sem absoluto, sem unidade e sem "..".
safe_path() {
  case "$1" in
    "" | /* | [A-Za-z]:* | ..* | */..* ) die "caminho inválido: $1" ;;
  esac
}
# Maior de duas versões vX.Y.Z.
newer() { printf '%s\n%s\n' "$1" "$2" | sed 's/^v//' | sort -t. -k1,1n -k2,2n -k3,3n | tail -n 1; }

command -v git >/dev/null 2>&1 || die "git não encontrado"
prefix=$(git rev-parse --show-prefix 2>/dev/null) || die "rode dentro de um repositório git"
[ -z "$prefix" ] || die "rode na raiz do repositório: $(git rev-parse --show-toplevel)"
[ -e tabularium-spec ] && die "este é o repositório do próprio tabularium; não se instala nele"

for f in CLAUDE.md spec/CLAUDE.md; do
  if [ -e "$f" ]; then
    die "$f encontrado. O tabularium só trabalha com AGENTS.md, e o Claude Code ignora o AGENTS.md quando existe CLAUDE.md. Migre o conteúdo de $f para AGENTS.md manualmente, apague $f e rode de novo."
  fi
done

# Instalação anterior.
old_version=""
old_source=""
old_files=""
if [ -f .tabularium ]; then
  old_version=$(sed -n 's/\r$//; s/^version=//p' .tabularium)
  old_source=$(sed -n 's/\r$//; s/^source=//p' .tabularium)
  old_files=$(sed -n 's/\r$//; s/^file=//p' .tabularium)
  is_semver "$old_version" || die ".tabularium com versão inválida: $old_version"
fi
source=${TABULARIUM_SOURCE:-${old_source:-$DEFAULT_SOURCE}}

# Versão alvo.
version=${TABULARIUM_VERSION:-}
if [ -z "$version" ]; then
  refs=$(git ls-remote --tags --refs "$source") || die "não foi possível consultar $source"
  version=$(printf '%s\n' "$refs" | sed 's|.*refs/tags/||' | grep -E "$SEMVER" \
    | sed 's/^v//' | sort -t. -k1,1n -k2,2n -k3,3n | tail -n 1)
  [ -n "$version" ] || die "nenhuma versão vX.Y.Z publicada em $source"
  version="v$version"
fi
is_semver "$version" || die "versão inválida: $version (use vX.Y.Z)"
if [ -n "$old_version" ] && [ "$old_version" != "$version" ] \
  && [ "$(newer "$old_version" "$version")" != "${version#v}" ] && [ "${TABULARIUM_ALLOW_DOWNGRADE:-}" != "1" ]; then
  die "$version é menor que a instalada ($old_version); use TABULARIUM_ALLOW_DOWNGRADE=1 para voltar"
fi

tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT
git -c advice.detachedHead=false clone --quiet --depth 1 --branch "$version" "$source" "$tmp/src" \
  || die "não foi possível baixar $version de $source"
[ -f "$tmp/src/tabularium.manifest" ] || die "$version não tem tabularium.manifest"

files=$(sed -e 's/\r$//' -e '/^#/d' -e '/^[[:space:]]*$/d' "$tmp/src/tabularium.manifest")
for f in $files; do
  safe_path "$f"
  [ -f "$tmp/src/$f" ] || die "arquivo do manifesto ausente em $version: $f"
done
for f in $old_files; do safe_path "$f"; done

# Bloco do AGENTS.md da versão: exatamente um BEGIN e um END depois dele.
markers() {
  awk -v b="$BEGIN" -v e="$END" '
    { l = $0; sub(/\r$/, "", l) }
    l == b { nb++; bl = NR }
    l == e { ne++; el = NR }
    END { print nb + 0, ne + 0, bl + 0, el + 0 }
  ' "$1"
}
set -- $(markers "$tmp/src/AGENTS.md")
[ "$1" = 1 ] && [ "$2" = 1 ] && [ "$4" -gt "$3" ] || die "$version sem bloco do tabularium no AGENTS.md"
sed -n "$3,$4p" "$tmp/src/AGENTS.md" | sed 's/\r$//' > "$tmp/block"
if [ -f AGENTS.md ]; then
  set -- $(markers AGENTS.md)
  if [ "$1" != 0 ] || [ "$2" != 0 ]; then
    [ "$1" = 1 ] && [ "$2" = 1 ] && [ "$4" -gt "$3" ] \
      || die "AGENTS.md precisa de exatamente um $BEGIN seguido de um $END; corrija à mão"
  fi
fi

# Apaga o que saiu do manifesto (antes de copiar, para não apagar uma renomeação só de caixa).
for f in $old_files; do
  if ! printf '%s\n' $files | grep -qxF "$f" && [ -e "$f" ]; then
    rm -f "$f"
    rmdir -p "$(dirname "$f")" 2>/dev/null || true
    echo "apagado: $f"
  fi
done

# Copia o manifesto, sobrescrevendo.
for f in $files; do
  mkdir -p "$(dirname "$f")"
  cp "$tmp/src/$f" "$f"
done

# Troca o bloco no AGENTS.md, preservando o resto e o fim de linha do arquivo.
if [ ! -f AGENTS.md ]; then
  cp "$tmp/block" AGENTS.md
else
  cr=""
  # head, tail e tr preservam o \r mesmo no Git Bash, onde sed, awk e grep o removem.
  if [ "$(head -n 1 AGENTS.md | wc -c)" != "$(head -n 1 AGENTS.md | tr -d '\r' | wc -c)" ]; then cr=$(printf '\r'); fi
  sed "s/\$/$cr/" "$tmp/block" > "$tmp/block-eol"
  set -- $(markers AGENTS.md)
  if [ "$1" = 1 ]; then
    { if [ "$3" -gt 1 ]; then head -n "$(($3 - 1))" AGENTS.md; fi
      cat "$tmp/block-eol"
      tail -n "+$(($4 + 1))" AGENTS.md; } > "$tmp/agents"
  else
    { cat "$tmp/block-eol"; printf '%s\n' "$cr"; cat AGENTS.md; } > "$tmp/agents"
  fi
  cp "$tmp/agents" AGENTS.md
fi

# Registro da instalação.
{
  echo "# Gerado pelo INSTALL do tabularium. Não edite à mão."
  echo "source=$source"
  echo "version=$version"
  for f in $files; do echo "file=$f"; done
} > .tabularium

echo "tabularium ${old_version:-(nenhum)} -> $version"
if [ -n "$old_version" ] && [ "${old_version%%.*}" != "${version%%.*}" ]; then
  echo "Versão maior diferente: o formato da spec pode ter mudado. Rode /spec-init para adaptar a spec no mesmo PR."
else
  echo "Rode /spec-init para configurar ou conferir a spec."
fi
echo "Revise o diff e abra um PR."
