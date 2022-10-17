package main

import (
	"bufio"
	"context"
	"fmt"
	"os/exec"
	"syscall"

	"github.com/wailsapp/wails"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct
type App struct {
	ctx     context.Context
	runtime *wails.Runtime
}

func (a *App) WailsInit(runtime *wails.Runtime) error {
	a.runtime = runtime
	return nil
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// Greet returns a greeting for the given name
func (a *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s, It's show time!", name)
}

// =====================================================================================

// func (a *App) UpdateStdOutBox(stdMsg string) string {
// 	return stdMsg
// }

// func (a *App) WailsInit(runtime *wails.Runtime) {
// 	message := fmt.Sprintf("I was initialised at fart o'clock")
// 	runtime.Events.Emit("tset", message)
// }

type Result struct {
	ResultType string `json:"resultType"`
	ResultRaw  string `json:"resultRaw"`
}

// Greet returns a greeting for the given name
func (a *App) GetYTtrack(url string) Result {
	cmd := exec.Command("youtube-dl", "-x", "--audio-format", "wav", "-o", "C:/Users/Austin/Music/samples/%(title)s.%(ext)s", url)

	// https://github.com/wailsapp/wails/discussions/1734#discussioncomment-3386172
	cmd.SysProcAttr = &syscall.SysProcAttr{
		HideWindow:    true,
		CreationFlags: 0x08000000, // https://learn.microsoft.com/en-us/windows/win32/procthread/process-creation-flags
	}

	stdout, err := cmd.StdoutPipe()
	if err != nil {
		// return err.Error()
		return Result{"error", err.Error()}
	}

	stderr, err2 := cmd.StderrPipe()
	if err2 != nil {
		// return err2.Error()
		return Result{"error", err2.Error()}
	}

	scanner := bufio.NewScanner(stdout)
	scannerErr := bufio.NewScanner(stderr)

	// https://stackoverflow.com/a/47217548
	go func() {
		for scanner.Scan() {
			c := scanner.Text()
			fmt.Println("## SCAN:", c)
			runtime.EventsEmit(a.ctx, "scanEv", "SCAN: "+c)
		}
	}()

	go func() {
		for scannerErr.Scan() {
			ce := scannerErr.Text()
			fmt.Println("## ERROR:", ce)
			runtime.EventsEmit(a.ctx, "scanEv", "ERROR: "+ce)
		}
	}()

	if err := cmd.Start(); err != nil {
		fmt.Println("Error: ", err)
		// return fmt.Sprintln("Error:", err)
		return Result{"error", err.Error()}
	}

	err = cmd.Wait()
	if err != nil {
		// return err.Error()
		return Result{"error", err.Error()}
	}

	return Result{"success", "Success!"}
}
