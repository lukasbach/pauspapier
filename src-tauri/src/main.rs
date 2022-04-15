
#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

#[tauri::command]
fn make_screenshot(x: i32, y: i32, dir: String) -> String {
  use screenshots::Capturer;
  use std::{fs::File, io::Write, time::Instant};
  use image::*;
  use webp::*;
  use std::path::Path;
  use  tauri::api::dir::with_temp_dir;

  println!("I was invoked from JS!");
  let start = Instant::now();

  let capturers = Capturer::screen_capturers();

  for capturer in capturers {
    if capturer.display_info.x == x && capturer.display_info.y == y {
      println!("1capturer {:?}", capturer);
      let image = capturer.capture_screen().unwrap();
      let buffer = image.png();
      let display_id = capturer.display_info.id.to_string();
      let path = dir + &display_id + ".png";
      let pathclone = path.clone();
      let mut file = File::create(path).unwrap();
      file.write_all(&buffer[..]).unwrap();
      return pathclone.into();
    }
  }

  // let capturer = Capturer::screen_capturer_from_point(100, 100).unwrap();
  // println!("2capturer {:?}", capturer);

  // let image = capturer.capture_screen().unwrap();
  // let buffer = image.png();
  // let mut file = File::create("capture_display_with_point.png").unwrap();
  // file.write_all(&buffer[..]).unwrap();

  println!("运行耗时: {:?}", start.elapsed());
  return String::from("");
}

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![make_screenshot])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
