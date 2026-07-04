import Tag from '#models/tag';
export default class TagsController {
    async index({ response }) {
        const tags = await Tag.query().orderBy('name', 'asc');
        return response.json(tags);
    }
}
//# sourceMappingURL=tags_controller.js.map