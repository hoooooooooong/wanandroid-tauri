use tauri_plugin_dialog::DialogExt;
use tauri_plugin_opener::OpenerExt;

#[tauri::command]
pub fn minimize_window(window: tauri::Window) {
    let _ = window.minimize();
}

#[tauri::command]
pub fn maximize_window(window: tauri::Window) {
    if window.is_maximized().unwrap_or(false) {
        let _ = window.unmaximize();
    } else {
        let _ = window.maximize();
    }
}

#[tauri::command]
pub fn close_window(window: tauri::Window) {
    let _ = window.close();
}

#[tauri::command]
pub fn is_maximized(window: tauri::Window) -> bool {
    window.is_maximized().unwrap_or(false)
}

#[tauri::command]
pub fn open_external(app: tauri::AppHandle, url: String) {
    let _ = app.opener().open_url(&url, None::<&str>);
}

#[tauri::command]
pub async fn confirm_quit(window: tauri::Window) -> bool {
    window
        .dialog()
        .message("确定要退出 WanAndroid Desktop 吗？")
        .title("确认退出")
        .buttons(tauri_plugin_dialog::MessageDialogButtons::OkCancel)
        .blocking_show()
}
