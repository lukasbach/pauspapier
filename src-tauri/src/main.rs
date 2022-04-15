
#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

#[tauri::command]
fn make_screenshot(x: i32, y: i32, dir: String) -> String {
  use screenshots::Capturer;
  use std::{fs::File, io::Write, time::Instant};

  println!("Starting screenshot");
  let start = Instant::now();

  let capturers = Capturer::screen_capturers();

  for capturer in capturers {
    if capturer.display_info.x == x && capturer.display_info.y == y {
      let image = capturer.capture_screen().unwrap();
      let buffer = image.png();
      let display_id = capturer.display_info.id.to_string();
      let path = dir + &display_id + ".png";
      let pathclone = path.clone();
      let mut file = File::create(path).unwrap();
      file.write_all(&buffer[..]).unwrap();
      println!("Saved screenshot in {:?}ms", start.elapsed());
      return pathclone.into();
    }
  }

  return String::from("");
}

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![make_screenshot])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
