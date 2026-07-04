var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { BaseModel, column } from '@adonisjs/lucid/orm';
import { DateTime } from 'luxon';
export class AuthAccessTokenSchema extends BaseModel {
    static $columns = ['abilities', 'createdAt', 'expiresAt', 'hash', 'id', 'lastUsedAt', 'name', 'tokenableId', 'type', 'updatedAt'];
    $columns = AuthAccessTokenSchema.$columns;
}
__decorate([
    column(),
    __metadata("design:type", String)
], AuthAccessTokenSchema.prototype, "abilities", void 0);
__decorate([
    column.dateTime({ autoCreate: true }),
    __metadata("design:type", Object)
], AuthAccessTokenSchema.prototype, "createdAt", void 0);
__decorate([
    column.dateTime(),
    __metadata("design:type", Object)
], AuthAccessTokenSchema.prototype, "expiresAt", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], AuthAccessTokenSchema.prototype, "hash", void 0);
__decorate([
    column({ isPrimary: true }),
    __metadata("design:type", Number)
], AuthAccessTokenSchema.prototype, "id", void 0);
__decorate([
    column.dateTime(),
    __metadata("design:type", Object)
], AuthAccessTokenSchema.prototype, "lastUsedAt", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], AuthAccessTokenSchema.prototype, "name", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], AuthAccessTokenSchema.prototype, "tokenableId", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], AuthAccessTokenSchema.prototype, "type", void 0);
__decorate([
    column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", Object)
], AuthAccessTokenSchema.prototype, "updatedAt", void 0);
export class CategorySchema extends BaseModel {
    static $columns = ['color', 'createdAt', 'description', 'icon', 'id', 'isActive', 'name', 'slug', 'updatedAt'];
    $columns = CategorySchema.$columns;
}
__decorate([
    column(),
    __metadata("design:type", Object)
], CategorySchema.prototype, "color", void 0);
__decorate([
    column.dateTime({ autoCreate: true }),
    __metadata("design:type", Object)
], CategorySchema.prototype, "createdAt", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], CategorySchema.prototype, "description", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], CategorySchema.prototype, "icon", void 0);
__decorate([
    column({ isPrimary: true }),
    __metadata("design:type", Number)
], CategorySchema.prototype, "id", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], CategorySchema.prototype, "isActive", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], CategorySchema.prototype, "name", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], CategorySchema.prototype, "slug", void 0);
__decorate([
    column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", Object)
], CategorySchema.prototype, "updatedAt", void 0);
export class LikeSchema extends BaseModel {
    static $columns = ['createdAt', 'id', 'quoteId', 'updatedAt', 'userId'];
    $columns = LikeSchema.$columns;
}
__decorate([
    column.dateTime({ autoCreate: true }),
    __metadata("design:type", Object)
], LikeSchema.prototype, "createdAt", void 0);
__decorate([
    column({ isPrimary: true }),
    __metadata("design:type", Number)
], LikeSchema.prototype, "id", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], LikeSchema.prototype, "quoteId", void 0);
__decorate([
    column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", Object)
], LikeSchema.prototype, "updatedAt", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], LikeSchema.prototype, "userId", void 0);
export class QuoteSchema extends BaseModel {
    static $columns = ['author', 'content', 'createdAt', 'id', 'source', 'updatedAt', 'userId'];
    $columns = QuoteSchema.$columns;
}
__decorate([
    column(),
    __metadata("design:type", Object)
], QuoteSchema.prototype, "author", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], QuoteSchema.prototype, "content", void 0);
__decorate([
    column.dateTime({ autoCreate: true }),
    __metadata("design:type", Object)
], QuoteSchema.prototype, "createdAt", void 0);
__decorate([
    column({ isPrimary: true }),
    __metadata("design:type", Number)
], QuoteSchema.prototype, "id", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], QuoteSchema.prototype, "source", void 0);
__decorate([
    column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", Object)
], QuoteSchema.prototype, "updatedAt", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], QuoteSchema.prototype, "userId", void 0);
export class SaveSchema extends BaseModel {
    static $columns = ['collection', 'createdAt', 'id', 'quoteId', 'updatedAt', 'userId'];
    $columns = SaveSchema.$columns;
}
__decorate([
    column(),
    __metadata("design:type", Object)
], SaveSchema.prototype, "collection", void 0);
__decorate([
    column.dateTime({ autoCreate: true }),
    __metadata("design:type", Object)
], SaveSchema.prototype, "createdAt", void 0);
__decorate([
    column({ isPrimary: true }),
    __metadata("design:type", Number)
], SaveSchema.prototype, "id", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], SaveSchema.prototype, "quoteId", void 0);
__decorate([
    column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", Object)
], SaveSchema.prototype, "updatedAt", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], SaveSchema.prototype, "userId", void 0);
export class TagSchema extends BaseModel {
    static $columns = ['createdAt', 'id', 'name', 'slug', 'updatedAt'];
    $columns = TagSchema.$columns;
}
__decorate([
    column.dateTime({ autoCreate: true }),
    __metadata("design:type", Object)
], TagSchema.prototype, "createdAt", void 0);
__decorate([
    column({ isPrimary: true }),
    __metadata("design:type", Number)
], TagSchema.prototype, "id", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], TagSchema.prototype, "name", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], TagSchema.prototype, "slug", void 0);
__decorate([
    column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", Object)
], TagSchema.prototype, "updatedAt", void 0);
export class UserSchema extends BaseModel {
    static $columns = ['avatar', 'createdAt', 'email', 'id', 'isBot', 'name', 'password', 'role', 'updatedAt', 'username'];
    $columns = UserSchema.$columns;
}
__decorate([
    column(),
    __metadata("design:type", Object)
], UserSchema.prototype, "avatar", void 0);
__decorate([
    column.dateTime({ autoCreate: true }),
    __metadata("design:type", DateTime)
], UserSchema.prototype, "createdAt", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], UserSchema.prototype, "email", void 0);
__decorate([
    column({ isPrimary: true }),
    __metadata("design:type", Number)
], UserSchema.prototype, "id", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], UserSchema.prototype, "isBot", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], UserSchema.prototype, "name", void 0);
__decorate([
    column({ serializeAs: null }),
    __metadata("design:type", String)
], UserSchema.prototype, "password", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], UserSchema.prototype, "role", void 0);
__decorate([
    column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", Object)
], UserSchema.prototype, "updatedAt", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], UserSchema.prototype, "username", void 0);
//# sourceMappingURL=schema.js.map