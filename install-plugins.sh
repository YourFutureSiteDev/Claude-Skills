#!/usr/bin/env bash
# Install the same marketplace plugins this Mac has.
# Run once on a new machine, then restart Claude.
set -u

claude plugin marketplace add anthropics/claude-plugins-official 2>/dev/null || true

PLUGINS="agent-sdk-dev clangd-lsp claude-code-setup claude-md-management
claude-security code-modernization code-review code-simplifier commit-commands
csharp-lsp cwc-makers explanatory-output-style feature-dev frontend-design
gopls-lsp hookify jdtls-lsp kotlin-lsp learning-output-style lua-lsp
math-olympiad mcp-server-dev mcp-tunnels php-lsp playground plugin-dev
pr-review-toolkit project-artifact pyright-lsp ralph-loop receipts ruby-lsp
rust-analyzer-lsp security-guidance session-report skill-creator swift-lsp
typescript-lsp"

for p in $PLUGINS; do
  if claude plugin install "$p@claude-plugins-official" -y -s user >/dev/null 2>&1; then
    echo "OK   $p"
  else
    echo "FAIL $p"
  fi
done
