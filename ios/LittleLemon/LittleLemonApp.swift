import SwiftUI

@main
struct LittleLemonApp: App {
    let persistenceController = PersistenceController.shared

    var body: some Scene {
        WindowGroup {
            MenuListView()
                .environment(\.managedObjectContext,
                             persistenceController.container.viewContext)
        }
    }
}