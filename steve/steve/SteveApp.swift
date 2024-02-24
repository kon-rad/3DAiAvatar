//
//  steveApp.swift
//  steve
//
//  Created by Ethan Sherbondy on 24/2/24.
//

import SwiftUI

@main
struct SteveApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
        }

        ImmersiveSpace(id: "ImmersiveSpace") {
            ImmersiveView()
        }.immersionStyle(selection: .constant(.progressive), in: .progressive)
    }
}
