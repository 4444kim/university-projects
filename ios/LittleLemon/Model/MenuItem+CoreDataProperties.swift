import Foundation
import CoreData

extension MenuItem {

    @nonobjc public class func fetchRequest() -> NSFetchRequest<MenuItem> {
        return NSFetchRequest<MenuItem>(entityName: "MenuItem")
    }

    @NSManaged public var id: Int32
    @NSManaged public var title: String?
    @NSManaged public var price: Double
    @NSManaged public var image: String?
}

extension MenuItem: Identifiable { }