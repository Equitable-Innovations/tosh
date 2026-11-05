// Package initcmd creates the .tosh directory and its configuration file.
package initcmd

import (
	"errors"
	"fmt"
	"io/fs"
	"os"
	"path/filepath"
)

const (
	// DirName is the name of the directory that tosh init creates.
	DirName = ".tosh"

	configFileName = "tosh.config.json"
	configContent  = "{}\n"
	tempDirPrefix  = ".tosh.tmp-"

	dirMode  fs.FileMode = 0o755
	fileMode fs.FileMode = 0o644
)

// ErrAlreadyInitialized means that the root already holds an entry named .tosh.
var ErrAlreadyInitialized = errors.New("already initialized")

// Options holds the input of Run.
type Options struct {
	// Root is the directory that receives .tosh.
	Root string

	// writeFile is a test seam. When nil, os.WriteFile is used.
	writeFile func(name string, data []byte, perm fs.FileMode) error
}

// Run creates .tosh/ and .tosh/tosh.config.json in the root in one atomic step.
func Run(opts Options) error {
	if err := checkRoot(opts.Root); err != nil {
		return err
	}
	target := filepath.Join(opts.Root, DirName)
	if err := checkTargetFree(target); err != nil {
		return err
	}

	// Build in a temporary directory, so a failure never leaves a partial .tosh.
	tmp, err := os.MkdirTemp(opts.Root, tempDirPrefix)
	if err != nil {
		return fmt.Errorf("create temporary directory: %w", err)
	}
	if err := populate(tmp, opts); err != nil {
		_ = os.RemoveAll(tmp)
		return err
	}
	if err := os.Rename(tmp, target); err != nil {
		_ = os.RemoveAll(tmp)
		return fmt.Errorf("rename temporary directory: %w", err)
	}
	return nil
}

func checkRoot(root string) error {
	info, err := os.Stat(root)
	if err != nil {
		return fmt.Errorf("check root: %w", err)
	}
	if !info.IsDir() {
		return fmt.Errorf("root %q is not a directory", root)
	}
	return nil
}

// checkTargetFree uses Lstat so that a symbolic link counts as an existing entry.
func checkTargetFree(target string) error {
	_, err := os.Lstat(target)
	if err == nil {
		return ErrAlreadyInitialized
	}
	if !errors.Is(err, fs.ErrNotExist) {
		return fmt.Errorf("check %s: %w", DirName, err)
	}
	return nil
}

func populate(dir string, opts Options) error {
	write := opts.writeFile
	if write == nil {
		write = os.WriteFile
	}
	// MkdirTemp uses mode 0700, so set the final mode explicitly.
	if err := os.Chmod(dir, dirMode); err != nil {
		return fmt.Errorf("set directory mode: %w", err)
	}
	cfg := filepath.Join(dir, configFileName)
	if err := write(cfg, []byte(configContent), fileMode); err != nil {
		return fmt.Errorf("write %s: %w", configFileName, err)
	}
	return nil
}
