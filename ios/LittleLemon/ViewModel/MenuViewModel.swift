import Foundation
import CoreData

struct MenuItemDTO: Codable {
    let id: Int
    let title: String
    let price: Double
    let image: String
}

struct MenuResponse: Codable {
    let menu: [MenuItemDTO]
}

class MenuViewModel: ObservableObject {
    @Published var searchText = ""

    let context = PersistenceController.shared.container.viewContext

    func fetchMenu() {
        guard let url = URL(string: "https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/menu.json")
        else { return }

        URLSession.shared.dataTask(with: url) { data, _, error in
            guard let data = data, error == nil else { return }

            do {
                let response = try JSONDecoder().decode(MenuResponse.self, from: data)
                DispatchQueue.main.async {
                    self.saveToCoreData(items: response.menu)
                }
            } catch {
                print("Decoding error:", error)
            }
        }.resume()
    }

    func saveToCoreData(items: [MenuItemDTO]) {
        for item in items {
            let entity = MenuItem(context: context)
            entity.id = Int32(item.id)
            entity.title = item.title
            entity.price = item.price
            entity.image = item.image
        }

        do {
            try context.save()
        } catch {
            print("Core Data save error:", error)
        }
    }
}