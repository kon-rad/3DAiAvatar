//
//  steveApp.swift
//  steve
//
//  Created by Ethan Sherbondy on 24/2/24.
//

import SwiftUI

@main
struct SteveApp: App {
    @StateObject private var appModel = AppModel()
  
    var body: some Scene {
        WindowGroup {
            ContentView()
              .environmentObject(appModel)

        }

        ImmersiveSpace(id: "ImmersiveSpace") {
            ImmersiveView()
              .environmentObject(appModel)
        }.immersionStyle(selection: .constant(.progressive), in: .progressive)
    }
}
