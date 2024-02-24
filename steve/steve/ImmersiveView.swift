//
//  ImmersiveView.swift
//  steve
//
//  Created by Ethan Sherbondy on 24/2/24.
//

import AVFoundation
import SwiftUI
import RealityKit
import RealityKitContent
import WhisperKit

var steve: Entity? = nil

struct ImmersiveView: View {
  @EnvironmentObject var appModel: AppModel

  var body: some View {
    RealityView { content in
      // Add the initial RealityKit content
        
        //skybox entity
        guard let skyboxEntity = createSkyBox() else{
            print("Error loading entity")
            return
        }
        
        content.add(skyboxEntity)
        
      if let immersiveContentEntity = try? await Entity(named: "Immersive", in: realityKitContentBundle) {
        content.add(immersiveContentEntity)
        
        // Add an ImageBasedLight for the immersive content
        guard let resource = try? await EnvironmentResource(named: "ImageBasedLight") else { return }
        let iblComponent = ImageBasedLightComponent(source: .single(resource), intensityExponent: 0.25)
        immersiveContentEntity.components.set(iblComponent)
        immersiveContentEntity.components.set(ImageBasedLightReceiverComponent(imageBasedLight: immersiveContentEntity))
        
        // Put skybox here.  See example in World project available at
        // https://developer.apple.com/
        // TODO: will render the SJ Theatre mesh from Dan here
        
        Task {
          if let steveEntity = immersiveContentEntity.findEntity(named: "Steve") {
            // 🙈 global variables, ugly but works for hackathon
            steve = steveEntity
            await makeSteveSayHello(steveEntity)
          } else {
            print("Failed to get steve entity")
          }
        }
      }
    }.task {
      if let sampleAudioUrl = Bundle.main.path(forResource: "sample_audio2", ofType: "mp3"),
         let pipe = whisperPipe {
        
        print("Attempting to transcribe audio via WhisperKit...")
        
        if let transcription = try? await pipe.transcribe(audioPath: sampleAudioUrl)?.text {
          print("🎉 Got transcript from Whisper: ", transcription)
          // Verdict from experiments: WhisperKit is too slow and
          // too inaccurate, will just use a textbox with Siri
//          appModel.yourText = transcription
        } else {
          print("😞 Failed to get transcript from Whisper for audio.")
        }
        
      } else {
        print(
          "❌ Faild to get sample_audio URL or pipe for Whisper playback: ", whisperPipe ?? "nil")
      }
    }
  }
  
    
    private func createSkyBox () -> Entity? {
        // create mesh
        let largeSphere = MeshResource.generateSphere(radius: 1000)
        //add Material
        var skyBoxMaterial = UnlitMaterial()
        
        do {
            let texture = try TextureResource.load(named: "TheaterSkyBox")
            skyBoxMaterial.color = .init(texture: .init(texture))
            
        } catch{
            print("Error loading texture")
        }
        // skybox entity
        let skyboxEntity = Entity()
        skyboxEntity.components.set(ModelComponent(mesh: largeSphere, materials: [skyBoxMaterial]))
        // Map texture to inner scale
        skyboxEntity.scale *= .init(x:-1,y:1,z:1)
        
        // Define the angle by which you want to rotate the entity (in radians)
        let angleInRadians = Float.pi / 2 // Rotating 90 degrees

        // Create a quaternion rotation around the Y axis
        let rotation = simd_quatf(angle: angleInRadians, axis: [0, 1, 0])
        
        skyboxEntity.transform.rotation =  rotation
        
        
        return skyboxEntity
    }
  func makeSteveSayHello(_ steveEntity: Entity) async {
    let helloText = "Hello, nice to meet you again after all these years."
    
    await appModel.makeSteveSay(text: helloText, steveEntity)
  }
}

#Preview {
    ImmersiveView()
        .previewLayout(.sizeThatFits)
}
