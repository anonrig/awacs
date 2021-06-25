## Documentation

Requirements are:
- Protobuf
  - `brew install protobuf`
- Go
  - `brew install go`
- Protoc-doc-gen
  - `go get -u github.com/pseudomuto/protoc-gen-doc/cmd/protoc-gen-doc`

### Installation

- **Install dependencies**
  - *(This command will run scripts/generate.js which will automatically copy the Helm definition to correct place and produce openapi.json inside `static` folder)*
```bash
$ npm install
```

- **Generate Proto JSON definitions**

```bash
$ protoc --doc_out=./static --doc_opt=json,proto_workspace.json --proto_path=../protofiles ../protofiles/**/*.proto
```

- **Generate Proto Markdown**

```bash
$ npx docusaurus generate-proto-docs
```

### Run

```bash
$ npm run start
```

### Build & Bundle

```bash
$ npm run build
```
