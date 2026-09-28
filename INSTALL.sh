#!/bin/sh
# Instala ou atualiza o tabularium no repositório git do diretório atual (a raiz).
#
#   curl -fsSL https://raw.githubusercontent.com/useful-toys/Tabularium/main/INSTALL.sh | sh
#
# Variáveis opcionais:
#   TABULARIUM_VERSION=v1.2.0        tag a instalar (padrão: a última)
#   TABULARIUM_SOURCE=<url git>      repositório de origem (padrão: o do .tabularium, ou o oficial)
#   TABULARIUM_ALLOW_DOWNGRADE=1     permite instalar tag menor que a instalada
#
# Copia os arquivos de tabularium.manifest da tag, sobrescrevendo; apaga os que saíram do manifesto;
# troca só o bloco do tabularium no AGENTS.md; grava origem, tag e arquivos em .tabularium.
# Não faz commit: revise o diff, rode /spec-init e abra um PR.
# Mesma lógica em INSTALL.ps1: mude os dois juntos.
set -eu

DEFAULT_SOURCE="https://github.com/useful-toys/Tabularium.git"
BEGIN="<!-- tabularium:begin -->"
END="<!-- tabularium:end -->"

die() { echo "tabularium: $*" >&2; exit 1; }

command -v git >/dev/null 2>&1 || die "git não encontrado"
top=$(git rev-parse --show-toplevel 2>/dev/null) || die "rode dentro de um repositório git"
[ "$(cd "$top" && pwd -P)" = "$(pwd -P)" ] || die "rode na raiz do repositório: $top"
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
  old_version=$(sed -n 's/^version=//p' .tabularium)
  old_source=$(sed -n 's/^source=//p' .tabularium)
  old_files=$(sed -n 's/^file=//p' .tabularium)
fi
source=${TABULARIUM_SOURCE:-${old_source:-$DEFAULT_SOURCE}}

# Versão alvo.
version=${TABULARIUM_VERSION:-}
if [ -z "$version" ]; then
  version=$(git ls-remote --tags --refs --sort=-v:refname "$source" 'v*' | head -n 1 | sed 's|.*refs/tags/||')
  [ -n "$version" ] || die "nenhuma versão publicada em $source"
fi

# Maior versão entre duas tags vX.Y.Z.
newer() { printf '%s\n%s\n' "$1" "$2" | sed 's/^v//' | sort -t. -k1,1n -k2,2n -k3,3n | tail -n 1; }
if [ -n "$old_version" ] && [ "$old_version" != "$version" ]; then
  if [ "$(newer "$old_version" "$version")" != "${version#v}" ] && [ "${TABULARIUM_ALLOW_DOWNGRADE:-}" != "1" ]; then
    die "$version é menor que a instalada ($old_version); use TABULARIUM_ALLOW_DOWNGRADE=1 para voltar"
  fi
fi

tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT
git -c advice.detachedHead=false clone --quiet --depth 1 --branch "$version" "$source" "$tmp/src" \
  || die "não foi possível baixar $version de $source"
[ -f "$tmp/src/tabularium.manifest" ] || die "$version não tem tabularium.manifest"

files=$(sed -e 's/\r$//' -e '/^#/d' -e '/^[[:space:]]*$/d' "$tmp/src/tabularium.manifest")

# Copia o manifesto, sobrescrevendo.
for f in $files; do
  [ -f "$tmp/src/$f" ] || die "arquivo do manifesto ausente em $version: $f"
  mkdir -p "$(dirname "$f")"
  cp "$tmp/src/$f" "$f"
done

# Apaga o que saiu do manifesto.
for f in $old_files; do
  if ! printf '%s\n' $files | grep -qxF "$f"; then
    rm -f "$f"
    rmdir -p "$(dirname "$f")" 2>/dev/null || true
    echo "apagado: $f"
  fi
done

# Bloco do AGENTS.md.
block=$(sed -n "/^$BEGIN\$/,/^$END\$/p" "$tmp/src/AGENTS.md")
[ -n "$block" ] || die "$version sem bloco do tabularium no AGENTS.md"
if [ ! -f AGENTS.md ]; then
  printf '%s\n' "$block" > AGENTS.md
elif grep -qxF "$BEGIN" AGENTS.md; then
  grep -qxF "$END" AGENTS.md || die "AGENTS.md tem $BEGIN sem $END; corrija à mão"
  printf '%s\n' "$block" > "$tmp/block"
  awk -v b="$BEGIN" -v e="$END" -v f="$tmp/block" '
    $0 == b { while ((getline l < f) > 0) print l; skip = 1; next }
    $0 == e { skip = 0; next }
    !skip { print }
  ' AGENTS.md > "$tmp/agents" && cp "$tmp/agents" AGENTS.md
else
  { printf '%s\n\n' "$block"; cat AGENTS.md; } > "$tmp/agents" && cp "$tmp/agents" AGENTS.md
fi

# Registro da instalação.
{
  echo "# Gerado pelo INSTALL do tabularium. Não edite à mão."
  echo "source=$source"
  echo "version=$version"
  for f in $files; do echo "file=$f"; done
} > .tabularium

echo "tabularium ${old_version:-(nenhum)} -> $version"
old_major=$(echo "${old_version#v}" | cut -d. -f1)
new_major=$(echo "${version#v}" | cut -d. -f1)
if [ -n "$old_version" ] && [ "$old_major" != "$new_major" ]; then
  echo "Versão major: o formato da spec mudou. Rode /spec-init para adaptar a spec no mesmo PR."
else
  echo "Rode /spec-init para configurar ou conferir a spec."
fi
echo "Revise o diff e abra um PR."
