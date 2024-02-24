//
//  AppModel.swift
//  steve
//
//  Created by Ethan Sherbondy on 24/2/24.
//

import Foundation
import RealityKit

class AppModel: ObservableObject {
  // steve's last message transcribed text to display
  // for UI feedback
  @Published var steveText: String = ""
  
  // your last message transcribed text to display
  // for UI feedback
  @Published var yourText: String = ""
  
  // track whether whisper is ready
  // just auto-set this to true since we're not using whisper
  @Published var whisperIsReady: Bool = true
  
  @Published var waitingForResponse: Bool = false
  
  func getSteveResponse(_ text: String) async {
    // TODO: make API request once konrad has rigged up,
    // then get response
    DispatchQueue.main.async {
      self.waitingForResponse = true
    }
    
    // TODO: once API rigged up should not just parrot response
    if let steveModel = steve {
//      let promptText = "You are Steve Jobs, the founder of Apple Computer. \(text)"
      let promptText = text
      
      // TODO: replace these with API-backed setup
      if bot != nil {
        print("Asking question to local LLM with prompt text: ", promptText)
        let question = bot?.preProcess(promptText, [])
        let answer = await bot!.getCompletion(from: question!)
        print("Got answer from local LLM: ", answer)
        await makeSteveSay(text: answer, steveModel)
      } else {
        print("Local LLM bot is nil, so just miming request for now")
        await makeSteveSay(text: text, steveModel)
      }
    } else {
      print("❌ steve Entity global variable not set for getSteveResponse call, bailing")
    }
    
    DispatchQueue.main.async {
      self.waitingForResponse = false
    }
  }

  func makeSteveSay(text: String, _ steveEntity: Entity) async {
    // POC: will have e2e sample of pipeline with eleven here via ElevenlabsSwift
    
    if let elevenApiKey = Bundle.main.infoDictionary?["ELEVEN_API_KEY"] as? String {
      print("✅ ELEVEN_API_KEY found, let's go!")
      let elevenApi = ElevenlabsSwift(elevenLabsAPI: elevenApiKey)
      let steveVoiceId = "Sq490XHHjzJSCEOLTxEV"
      
      do {
        let audioUrl = try await elevenApi.textToSpeech(
          voice_id: steveVoiceId,
          text: text)
        
        print("Got audio URL back from Eleven: ", audioUrl)
        
        // at this point we have the data stored in a temp local url file,
        // and we should be able to play it back directly.
        // We do spatial audio on the steve model entity by traversing >
        // pulling out of the RCP scene.

        let sfxConfig = AudioFileResource.Configuration(
          loadingStrategy: .stream,
          shouldLoop: false,
          shouldRandomizeStartTime: false,
          normalization: .dynamic)
        
        let resource = try await AudioFileResource.load(contentsOf: audioUrl,
                                                  configuration: sfxConfig)
        
        await steveEntity.playAudio(resource)
        
        DispatchQueue.main.async {
          self.steveText = text
        }
      } catch {
        print("Got an error calling ElevenLabs API: ", error)
      }
    } else {
      print("❌ No ELEVEN_API_KEY found in Secrets.xcconfig, make sure this file exists, check the gist squad!")
    }
  }
}
