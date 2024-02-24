//
//  AppModel.swift
//  steve
//
//  Created by Ethan Sherbondy on 24/2/24.
//

import Foundation

class AppModel: ObservableObject {
  // steve's last message transcribed text to display
  // for UI feedback
  @Published var steveText: String = ""
  
  // your last message transcribed text to display
  // for UI feedback
  @Published var yourText: String = ""
}
