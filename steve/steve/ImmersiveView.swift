//
//  ImmersiveView.swift
//  steve
//
//  Created by Ethan Sherbondy on 24/2/24.
//

import ElevenlabsSwift
import SwiftUI
import RealityKit
import RealityKitContent

struct ImmersiveView: View {
    var body: some View {
        RealityView { content in
            // Add the initial RealityKit content
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
              
              
              // POC: will have e2e sample of pipeline with eleven here via ElevenlabsSwift
              
              if let elevenApiKey = Bundle.main.infoDictionary?["ELEVEN_API_KEY"] as? String {
                print("✅ ELEVEN_API_KEY found, let's go!")
                let elevenApi = ElevenlabsSwift(elevenLabsAPI: elevenApiKey)
              } else {
                print("❌ No ELEVEN_API_KEY found in Secrets.xcconfig, make sure this file exists, check the gist squad!")
              }
            }
        }
    }
}

#Preview {
    ImmersiveView()
        .previewLayout(.sizeThatFits)
}
