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
            await makeSteveSayHello(steveEntity)
          } else {
            print("Failed to get steve entity")
          }
        }
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
    // POC: will have e2e sample of pipeline with eleven here via ElevenlabsSwift
    
    if let elevenApiKey = Bundle.main.infoDictionary?["ELEVEN_API_KEY"] as? String {
      print("✅ ELEVEN_API_KEY found, let's go!")
      let elevenApi = ElevenlabsSwift(elevenLabsAPI: elevenApiKey)
      let steveVoiceId = "Sq490XHHjzJSCEOLTxEV"
      
      do {
        let steveText = "Hello, nice to meet you again after all these years."
        
        let audioUrl = try await elevenApi.textToSpeech(
          voice_id: steveVoiceId,
          text: steveText)
        
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
        
        let resource = try AudioFileResource.load(contentsOf: audioUrl,
                                                  configuration: sfxConfig)
        
        steveEntity.playAudio(resource)
        
        appModel.steveText = steveText
      } catch {
        print("Got an error calling ElevenLabs API: ", error)
      }
    } else {
      print("❌ No ELEVEN_API_KEY found in Secrets.xcconfig, make sure this file exists, check the gist squad!")
    }
  }
}

#Preview {
    ImmersiveView()
        .previewLayout(.sizeThatFits)
}
