//
//  ContentView.swift
//  steve
//
//  Created by Ethan Sherbondy on 24/2/24.
//

import SwiftUI
import RealityKit
import RealityKitContent

struct ContentView: View {

    @State private var showImmersiveSpace = false
    @State private var immersiveSpaceIsShown = false
  
    @EnvironmentObject var appModel: AppModel

    @Environment(\.openImmersiveSpace) var openImmersiveSpace
    @Environment(\.dismissImmersiveSpace) var dismissImmersiveSpace

    var body: some View {
      VStack {
        if !showImmersiveSpace {
          Model3D(named: "Scene", bundle: realityKitContentBundle)
              .padding(.bottom, 50)
          
          Text("Are you ready to meet Steve?")
        }

        Toggle(
          showImmersiveSpace ? "Bye, Steve" : "Meet Steve",
          isOn: $showImmersiveSpace)
            .toggleStyle(.button)
            .padding(.top, 30)
            .padding(.bottom, 30)
      
        // placeholder to show your latest convo text
        Text("Steve: \(appModel.steveText)")
          .padding(.bottom, 30)
        
        Text("You: \(appModel.yourText)")
      }
      .padding()
      .onChange(of: showImmersiveSpace) { _, newValue in
        Task {
          if newValue {
            switch await openImmersiveSpace(id: "ImmersiveSpace") {
            case .opened:
              immersiveSpaceIsShown = true
            case .error, .userCancelled:
              fallthrough
            @unknown default:
              immersiveSpaceIsShown = false
              showImmersiveSpace = false
            }
          } else if immersiveSpaceIsShown {
            await dismissImmersiveSpace()
            immersiveSpaceIsShown = false
          }
        }
      }
  }
}

#Preview(windowStyle: .automatic) {
    ContentView()
}
