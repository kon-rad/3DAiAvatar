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
          Model3D(named: "immersive", bundle: realityKitContentBundle)
              .padding(.bottom, 50)
            Image("steve-obit-pic").resizable().aspectRatio(contentMode: .fit).padding(.vertical,25)
        
            
            
          Text("Are you ready to meet Steve?")
        }

        Toggle(
          showImmersiveSpace ? "Bye, Steve" : (
            appModel.whisperIsReady ? "Meet Steve" : "Getting Ready"
          ),
          isOn: $showImmersiveSpace)
            .toggleStyle(.button)
            .padding(.top, 30)
            .padding(.bottom, 30)
            .disabled(!appModel.whisperIsReady)
      
        // placeholder to show your latest convo text
        if showImmersiveSpace {
          Text("Steve: \(appModel.steveText)")
            .padding(.bottom, 30)
          
          Text("You: \(appModel.yourText)")
            .padding(.bottom, 30)
          
          HStack {
            TextField(
              "Talk to Steve",
              text: $appModel.yourText
            )
            .padding(.all, 16)
            
            Button(LocalizedStringKey("Send"),
                   systemImage: "paperplane.circle.fill") {
              // TODO: hook up LLM call to ask steve a question
              print("Should send to steve")
              
              if steve != nil {
                Task {
                  await appModel.getSteveResponse(appModel.yourText)
                }
              } else {
                print("steve entity global is not set, cannot call")
              }
            }
          }.padding(.all, 16)
        }
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
