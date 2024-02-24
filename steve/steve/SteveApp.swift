//
//  steveApp.swift
//  steve
//
//  Created by Ethan Sherbondy on 24/2/24.
//

import SwiftUI
import WhisperKit

// Initialize WhisperKit with default settings on app init
var whisperPipe: WhisperKit? = nil

@main
struct SteveApp: App {
  @StateObject private var appModel = AppModel()
  
  var body: some Scene {
      WindowGroup {
        ContentView()
          .environmentObject(appModel)
          .task {
            print("Loading WhisperKit on ContentView task")
            whisperPipe = try? await WhisperKit(model: "large-v3_turbo_1307MB")
            appModel.whisperIsReady = true
            print("📢 Successfully initialized WhisperKit")
          }
      }

      ImmersiveSpace(id: "ImmersiveSpace") {
        ImmersiveView()
          .environmentObject(appModel)
      }.immersionStyle(selection: .constant(.progressive), in: .progressive)
  }
}
