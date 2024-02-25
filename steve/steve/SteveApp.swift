//
//  steveApp.swift
//  steve
//
//  Created by Ethan Sherbondy on 24/2/24.
//

import LLM
import SwiftUI
import WhisperKit

// Initialize WhisperKit with default settings on app init
var whisperPipe: WhisperKit? = nil

// for local LLM testing POC
var bot: LLM? = nil

@main
struct SteveApp: App {
  @StateObject private var appModel = AppModel()
  
  var body: some Scene {
      WindowGroup {
        ContentView()
          .environmentObject(appModel)
          .task {
            // WhisperKit is not up to the task, so we are disabling
//            print("Loading WhisperKit on ContentView task")
//            whisperPipe = try? await WhisperKit(model: "large-v3_turbo_1307MB")
//            appModel.whisperIsReady = true
//            print("📢 Successfully initialized WhisperKit")
            
            // the mistral model just seems to be too slow unfortunately and adds 3GB to bundle,
            // slowing down dev iteration installing the app onto the device
//            if let mistralUrl = Bundle.main.url(forResource: "mistral-7b-instruct-v0.2.Q4_K_M", withExtension: "gguf") {
//              bot = LLM(from: mistralUrl, template: .mistral)
              
              let systemPrompt = "You are Steve Jobs, the founder of Apple Computer."

              let model = HuggingFaceModel("TheBloke/TinyLlama-1.1B-Chat-v1.0-GGUF", .Q2_K, template: .chatML(systemPrompt))
              
              bot = try? await LLM(from: model) { progress in print("Init bot progress: \(progress)%")
              }
              
              if bot != nil {
                print("Initialized LLM bot from local Mistral gguf file")
              } else {
                print("Failed to initialize LLM bot")
              }
//            } else {
//              print("❌ No local mistral model file found, please download it from: https://huggingface.co/TheBloke/Mistral-7B-Instruct-v0.2-GGUF/tree/main and drag into the steve/ directory in Xcode")
//            }
          }
      }.defaultSize(width: 600, height: 600)
//          .windowStyle(.plain)

      ImmersiveSpace(id: "ImmersiveSpace") {
        ImmersiveView()
          .environmentObject(appModel)
      }.immersionStyle(selection: .constant(.progressive), in: .progressive)
  }
}
