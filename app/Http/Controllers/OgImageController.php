<?php

namespace App\Http\Controllers;

use App\Models\Quote;
use Illuminate\Http\Request;

class OgImageController extends Controller
{
    /**
     * Generate an Open Graph image for a quote.
     */
    public function generate(Quote $quote)
    {
        // Set dimensions for social media (1200x630 is optimal for OG images)
        $width = 1200;
        $height = 630;

        // Create image
        $image = imagecreatetruecolor($width, $height);

        // Parse gradient colors (simplified - using first color)
        // In production, you might want to use a library for better gradient support
        $bgColor = imagecolorallocate($image, 102, 126, 234); // Purple default

        // Fill background
        imagefilledrectangle($image, 0, 0, $width, $height, $bgColor);

        // Add semi-transparent overlay for better text readability
        $overlay = imagecolorallocatealpha($image, 0, 0, 0, 50);
        imagefilledrectangle($image, 0, 0, $width, $height, $overlay);

        // Text color
        $textColor = imagecolorallocate($image, 255, 255, 255);

        // Font paths (make sure these fonts exist or use system fonts)
        $fontPath = public_path('fonts/Inter-Bold.ttf');
        $authorFontPath = public_path('fonts/Inter-SemiBold.ttf');

        // If fonts don't exist, use built-in fonts
        $useBuiltInFont = !file_exists($fontPath);

        // Add quote text with word wrapping
        $maxWidth = $width - 200; // Padding
        $fontSize = 36;
        $y = 200;

        if (!$useBuiltInFont) {
            // Word wrap for quote content
            $words = explode(' ', $quote->content);
            $lines = [];
            $currentLine = '';

            foreach ($words as $word) {
                $testLine = $currentLine . ' ' . $word;
                $bbox = imagettfbbox($fontSize, 0, $fontPath, $testLine);
                $lineWidth = $bbox[2] - $bbox[0];

                if ($lineWidth > $maxWidth && $currentLine !== '') {
                    $lines[] = trim($currentLine);
                    $currentLine = $word;
                } else {
                    $currentLine = $testLine;
                }
            }
            $lines[] = trim($currentLine);

            // Center and draw text
            foreach ($lines as $line) {
                $bbox = imagettfbbox($fontSize, 0, $fontPath, $line);
                $textWidth = $bbox[2] - $bbox[0];
                $x = ($width - $textWidth) / 2;
                imagettftext($image, $fontSize, 0, $x, $y, $textColor, $fontPath, '"' . $line . '"');
                $y += 60;
            }

            // Add author
            if ($quote->author) {
                $authorText = '— ' . $quote->author;
                $bbox = imagettfbbox(28, 0, $authorFontPath, $authorText);
                $textWidth = $bbox[2] - $bbox[0];
                $x = ($width - $textWidth) / 2;
                imagettftext($image, 28, 0, $x, $y + 40, $textColor, $authorFontPath, $authorText);
            }
        } else {
            // Fallback to built-in font
            $text = '"' . substr($quote->content, 0, 150) . (strlen($quote->content) > 150 ? '..."' : '"');
            imagestring($image, 5, 100, 250, $text, $textColor);
            
            if ($quote->author) {
                imagestring($image, 4, 100, 350, '— ' . $quote->author, $textColor);
            }
        }

        // Add branding
        $brandText = 'QuotesHub.com';
        if (!$useBuiltInFont) {
            $bbox = imagettfbbox(20, 0, $authorFontPath, $brandText);
            $textWidth = $bbox[2] - $bbox[0];
            $x = ($width - $textWidth) / 2;
            imagettftext($image, 20, 0, $x, $height - 40, $textColor, $authorFontPath, $brandText);
        } else {
            imagestring($image, 3, ($width / 2) - 60, $height - 40, $brandText, $textColor);
        }

        // Output image
        header('Content-Type: image/png');
        header('Cache-Control: public, max-age=86400'); // Cache for 24 hours
        imagepng($image);
        imagedestroy($image);
        exit;
    }
}
