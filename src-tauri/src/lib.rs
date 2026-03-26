mod commands;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_window_state::Builder::default().build())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            commands::window::minimize_window,
            commands::window::maximize_window,
            commands::window::close_window,
            commands::window::is_maximized,
            commands::window::open_external,
            commands::window::confirm_quit,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
