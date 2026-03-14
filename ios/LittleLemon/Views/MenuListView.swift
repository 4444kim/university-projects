import SwiftUI
import CoreData

struct MenuListView: View {
    @StateObject var viewModel = MenuViewModel()

    @FetchRequest(
        sortDescriptors: [
            NSSortDescriptor(
                key: "title",
                ascending: true,
                selector: #selector(NSString.localizedCaseInsensitiveCompare)
            )
        ],
        animation: .default
    )
    private var items: FetchedResults<MenuItem>

    @State private var showAlert = false
    @State private var selectedItem: MenuItem?

    var filteredItems: [MenuItem] {
        let query = viewModel.searchText
            .folding(options: .diacriticInsensitive, locale: .current)
            .lowercased()

        if query.isEmpty { return Array(items) }

        return items.filter { item in
            item.title?
                .folding(options: .diacriticInsensitive, locale: .current)
                .lowercased()
                .contains(query) ?? false
        }
    }

    var body: some View {
        NavigationView {
            List(filteredItems) { item in
                Text(item.title ?? "")
                    .onTapGesture {
                        selectedItem = item
                        showAlert = true
                    }
            }
            .navigationTitle("Menu")
            .searchable(text: $viewModel.searchText)
            .alert("Order confirmed!", isPresented: $showAlert) {
                Button("OK", role: .cancel) {}
            } message: {
                Text("You ordered \(selectedItem?.title ?? "")")
            }
        }
        .onAppear {
            if items.isEmpty {
                viewModel.fetchMenu()
            }
        }
    }
}