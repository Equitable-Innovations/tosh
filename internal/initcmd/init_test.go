package initcmd

import (
	"errors"
	"os"
	"path/filepath"
	"runtime"
	"strings"
	"testing"
)

const wantConfig = "{}\n"

func writeFileOrFail(t *testing.T, path, content string) {
	t.Helper()
	if err := os.WriteFile(path, []byte(content), 0o644); err != nil {
		t.Fatal(err)
	}
}

func readFileOrFail(t *testing.T, path string) string {
	t.Helper()
	data, err := os.ReadFile(path)
	if err != nil {
		t.Fatal(err)
	}
	return string(data)
}

func entryNames(t *testing.T, dir string) []string {
	t.Helper()
	entries, err := os.ReadDir(dir)
	if err != nil {
		t.Fatal(err)
	}
	names := make([]string, 0, len(entries))
	for _, e := range entries {
		names = append(names, e.Name())
	}
	return names
}

func TestRunCreatesDirectoryAndConfig(t *testing.T) {
	root := t.TempDir()
	if err := Run(Options{Root: root}); err != nil {
		t.Fatalf("Run returned error: %v", err)
	}
	dirInfo, err := os.Stat(filepath.Join(root, DirName))
	if err != nil || !dirInfo.IsDir() {
		t.Fatalf(".tosh is not a directory: %v", err)
	}
	cfg := filepath.Join(root, DirName, "tosh.config.json")
	if got := readFileOrFail(t, cfg); got != wantConfig {
		t.Fatalf("config content = %q, want %q", got, wantConfig)
	}
	if runtime.GOOS != "windows" {
		fileInfo, _ := os.Stat(cfg)
		if fileInfo.Mode().Perm() != 0o644 {
			t.Errorf("file mode = %v, want 0644", fileInfo.Mode().Perm())
		}
		if dirInfo.Mode().Perm() != 0o755 {
			t.Errorf("dir mode = %v, want 0755", dirInfo.Mode().Perm())
		}
	}
	if names := entryNames(t, root); len(names) != 1 {
		t.Errorf("root entries = %v, want only .tosh", names)
	}
}

func TestRunAlreadyInitializedKeepsFiles(t *testing.T) {
	root := t.TempDir()
	dir := filepath.Join(root, DirName)
	if err := os.Mkdir(dir, 0o755); err != nil {
		t.Fatal(err)
	}
	writeFileOrFail(t, filepath.Join(dir, "tosh.config.json"), `{"a":1}`)
	writeFileOrFail(t, filepath.Join(dir, "other.txt"), "keep")

	if err := Run(Options{Root: root}); !errors.Is(err, ErrAlreadyInitialized) {
		t.Fatalf("err = %v, want ErrAlreadyInitialized", err)
	}
	if got := readFileOrFail(t, filepath.Join(dir, "tosh.config.json")); got != `{"a":1}` {
		t.Errorf("config changed: %q", got)
	}
	if got := readFileOrFail(t, filepath.Join(dir, "other.txt")); got != "keep" {
		t.Errorf("other.txt changed: %q", got)
	}
	if names := entryNames(t, root); len(names) != 1 {
		t.Errorf("root entries = %v", names)
	}
}

func TestRunAlreadyInitializedEmptyDirectory(t *testing.T) {
	root := t.TempDir()
	if err := os.Mkdir(filepath.Join(root, DirName), 0o755); err != nil {
		t.Fatal(err)
	}
	if err := Run(Options{Root: root}); !errors.Is(err, ErrAlreadyInitialized) {
		t.Fatalf("err = %v, want ErrAlreadyInitialized", err)
	}
	if names := entryNames(t, filepath.Join(root, DirName)); len(names) != 0 {
		t.Errorf(".tosh entries = %v, want none", names)
	}
}

func TestRunAlreadyInitializedFile(t *testing.T) {
	root := t.TempDir()
	path := filepath.Join(root, DirName)
	writeFileOrFail(t, path, "data")
	if err := Run(Options{Root: root}); !errors.Is(err, ErrAlreadyInitialized) {
		t.Fatalf("err = %v, want ErrAlreadyInitialized", err)
	}
	if got := readFileOrFail(t, path); got != "data" {
		t.Errorf("file changed: %q", got)
	}
}

func TestRunLeavesNoPartialDirectoryOnWriteFailure(t *testing.T) {
	root := t.TempDir()
	forced := errors.New("forced write failure")
	opts := Options{
		Root: root,
		writeFile: func(string, []byte, os.FileMode) error {
			return forced
		},
	}
	err := Run(opts)
	if !errors.Is(err, forced) {
		t.Fatalf("err = %v, want wrapped forced error", err)
	}
	if names := entryNames(t, root); len(names) != 0 {
		t.Errorf("root entries = %v, want none", names)
	}
}

func TestRunMissingRoot(t *testing.T) {
	err := Run(Options{Root: filepath.Join(t.TempDir(), "missing")})
	if err == nil || errors.Is(err, ErrAlreadyInitialized) {
		t.Fatalf("err = %v, want non-nil and not ErrAlreadyInitialized", err)
	}
}

func TestRunRootIsFile(t *testing.T) {
	path := filepath.Join(t.TempDir(), "file")
	writeFileOrFail(t, path, "x")
	err := Run(Options{Root: path})
	if err == nil || errors.Is(err, ErrAlreadyInitialized) {
		t.Fatalf("err = %v, want non-nil and not ErrAlreadyInitialized", err)
	}
}

func TestRunReadOnlyRoot(t *testing.T) {
	if runtime.GOOS == "windows" {
		t.Skip("directory modes do not block writes on Windows")
	}
	if os.Geteuid() == 0 {
		t.Skip("root ignores directory modes")
	}
	root := t.TempDir()
	if err := os.Chmod(root, 0o555); err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() { _ = os.Chmod(root, 0o755) })
	if err := Run(Options{Root: root}); err == nil {
		t.Fatal("want error for read-only root")
	}
	for _, name := range entryNames(t, root) {
		if strings.HasPrefix(name, ".tosh") {
			t.Errorf("unexpected entry %q", name)
		}
	}
}

func TestRunKeepsOtherFiles(t *testing.T) {
	root := t.TempDir()
	writeFileOrFail(t, filepath.Join(root, "README.md"), "hello")
	if err := Run(Options{Root: root}); err != nil {
		t.Fatal(err)
	}
	if got := readFileOrFail(t, filepath.Join(root, "README.md")); got != "hello" {
		t.Errorf("README.md changed: %q", got)
	}
}
