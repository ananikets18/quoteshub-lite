<?php

namespace Database\Factories;

use App\Models\Quote;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Quote>
 */
class QuoteFactory extends Factory
{
    protected $model = Quote::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'content' => fake()->realText(150),
            'author' => fake()->name(),
            'source' => fake()->optional()->sentence(3),
            'status' => 'approved',
            'likes_count' => fake()->numberBetween(0, 500),
            'saves_count' => fake()->numberBetween(0, 200),
            'shares_count' => fake()->numberBetween(0, 100),
            'views_count' => fake()->numberBetween(0, 1000),
        ];
    }

    /**
     * Indicate that the quote is pending approval.
     */
    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'pending',
        ]);
    }
}
