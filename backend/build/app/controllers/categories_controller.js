import Category from '#models/category';
export default class CategoriesController {
    async index({ response }) {
        const categories = await Category.query()
            .where('is_active', true)
            .orderBy('name', 'asc');
        return response.json(categories);
    }
}
//# sourceMappingURL=categories_controller.js.map