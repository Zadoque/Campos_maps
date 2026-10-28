{
  description = "Campos Maps - mapa viario com Neo4j, Spring Boot e React";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";

  outputs = { self, nixpkgs }:
    let
      systems = [ "x86_64-linux" "aarch64-linux" "x86_64-darwin" "aarch64-darwin" ];
      forAllSystems = f: nixpkgs.lib.genAttrs systems (system: f nixpkgs.legacyPackages.${system});
    in {
      devShells = forAllSystems (pkgs: {
        default = pkgs.mkShell {
          packages = with pkgs; [
            jdk21
            maven
            nodejs_22
            chromium
            curl
            jq
            osmium-tool
            (python3.withPackages (ps: [ ps.neo4j ]))
          ];

          shellHook = ''
            export JAVA_HOME=${pkgs.jdk21}
            export PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=${pkgs.chromium}/bin/chromium
            export PATH="$PWD/node_modules/.bin:$PWD/frontend/node_modules/.bin:$PATH"
            echo "Campos Maps dev shell"
            echo "Java:    $(java -version 2>&1 | head -1)"
            echo "Node:    $(node --version)"
            echo "Maven:   $(mvn --version | head -1)"
            echo "Use: docker compose up -d; (cd backend && mvn spring-boot:run); (cd frontend && npm run dev)"
          '';
        };
      });
    };
}
