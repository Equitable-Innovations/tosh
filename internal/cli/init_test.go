package cli

import (
	"bytes"
	"errors"
	"os"
	"path/filepath"
	"strings"
	"testing"

	"github.com/Equitable-Innovations/tosh/internal/initcmd"
)

func runInit(t *testing.T, workDir string, args ...string) (code int, stdout, stderr string) {
	t.Helper()
	out, errOut := &bytes.Buffer{}, &bytes.Buffer{}
	env := Env{Stdout: out, Stderr: errOut, WorkDir: workDir}
	code = Run(env, append([]string{"init"}, args...))
	return code, out.String(), errOut.String()
}

func TestInitCreatesDirectoryText(t *testing.T) {
	root := t.TempDir()
	code, stdout, _ := runInit(t, t.TempDir(), "--root", root, "--format", "text")
	if code != ExitOK {
		t.Fatalf("code = %d", code)
	}
	if stdout != "Created .tosh/\n" {
		t.Errorf("stdout = %q", stdout)
	}
	if _, err := os.Stat(filepath.Join(root, ".tosh", "tosh.config.json")); err != nil {
		t.Errorf("config file missing: %v", err)
	}
}

func TestInitCreatesDirectoryJSON(t *testing.T) {
	code, stdout, _ := runInit(t, t.TempDir(), "--root", t.TempDir(), "--format", "json")
	if code != ExitOK {
		t.Fatalf("code = %d", code)
	}
	if stdout != "{\"created\":\".tosh\"}\n" {
		t.Errorf("stdout = %q", stdout)
	}
}

func TestInitTwiceExitsTwo(t *testing.T) {
	root := t.TempDir()
	runInit(t, root, "--root", root, "--format", "text")
	cfg := filepath.Join(root, ".tosh", "tosh.config.json")
	before, err := os.ReadFile(cfg)
	if err != nil {
		t.Fatal(err)
	}
	code, stdout, stderr := runInit(t, root, "--root", root, "--format", "text")
	if code != ExitUsage {
		t.Errorf("code = %d, want %d", code, ExitUsage)
	}
	if stdout != "" {
		t.Errorf("stdout = %q", stdout)
	}
	if stderr != ".tosh/ already exists. No change made.\n" {
		t.Errorf("stderr = %q", stderr)
	}
	after, _ := os.ReadFile(cfg)
	if !bytes.Equal(before, after) {
		t.Error("config file changed")
	}
}

func TestInitTwiceJSONError(t *testing.T) {
	root := t.TempDir()
	runInit(t, root, "--root", root)
	code, _, stderr := runInit(t, root, "--root", root, "--format", "json")
	if code != ExitUsage {
		t.Errorf("code = %d", code)
	}
	if name := errorName(t, stderr); name != "already_initialized" {
		t.Errorf("error name = %q", name)
	}
	want := "{\"error\":\"already_initialized\",\"message\":\".tosh/ already exists. No change made.\"}\n"
	if stderr != want {
		t.Errorf("stderr = %q", stderr)
	}
}

func TestInitDefaultsToWorkingDirectory(t *testing.T) {
	work := t.TempDir()
	code, _, stderr := runInit(t, work, "--format", "text")
	if code != ExitOK {
		t.Fatalf("code = %d, stderr = %q", code, stderr)
	}
	if _, err := os.Stat(filepath.Join(work, ".tosh")); err != nil {
		t.Errorf(".tosh missing in working directory: %v", err)
	}
}

func TestInitQuiet(t *testing.T) {
	root := t.TempDir()
	code, stdout, _ := runInit(t, t.TempDir(), "--root", root, "--quiet")
	if code != ExitOK || stdout != "" {
		t.Errorf("code = %d, stdout = %q", code, stdout)
	}
	if _, err := os.Stat(filepath.Join(root, ".tosh")); err != nil {
		t.Errorf(".tosh missing: %v", err)
	}
}

func TestInitRejectsExtraArguments(t *testing.T) {
	root := t.TempDir()
	code, _, stderr := runInit(t, root, "--root", root, "--format", "json", "extra")
	if code != ExitUsage {
		t.Errorf("code = %d", code)
	}
	if name := errorName(t, stderr); name != "invalid_argument" {
		t.Errorf("error name = %q", name)
	}
	if _, err := os.Stat(filepath.Join(root, ".tosh")); err == nil {
		t.Error(".tosh was created")
	}
}

func TestInitUnexpectedErrorExitsOne(t *testing.T) {
	failing := func(initcmd.Options) error { return errors.New("disk on fire") }
	out, errOut := &bytes.Buffer{}, &bytes.Buffer{}
	env := Env{Stdout: out, Stderr: errOut, WorkDir: t.TempDir()}
	root := NewRootCommand(env)
	root.RemoveCommand(root.Commands()...)
	root.AddCommand(newInitCommand(env, failing))
	code := execute(root, env, []string{"init", "--format", "text"})
	if code != ExitFailure {
		t.Errorf("code = %d, want %d", code, ExitFailure)
	}
	if !strings.Contains(errOut.String(), "disk on fire") {
		t.Errorf("stderr = %q", errOut.String())
	}
}

func TestInitExitTwoNamesDiffer(t *testing.T) {
	root := t.TempDir()
	runInit(t, root, "--root", root)
	_, _, twice := runInit(t, root, "--root", root, "--format", "json")
	_, _, extra := runInit(t, root, "--root", root, "--format", "json", "extra")
	if errorName(t, twice) == errorName(t, extra) {
		t.Errorf("names equal: %q", errorName(t, twice))
	}
}
