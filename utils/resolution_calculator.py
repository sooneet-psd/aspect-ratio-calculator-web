#!/usr/bin/env python3

import math
import json
import sys
from typing import List, Dict, Tuple

class ResolutionCalculator:
    def __init__(self):
        # Common base resolutions to scale from
        self.base_resolutions = {
            'small': [720, 1080],
            'medium': [1440, 1920, 2048],
            'large': [2560, 3840, 4096],
            'ultra': [5120, 7680, 8192]
        }

        # Standard aspect ratios and their common names
        self.standard_ratios = {
            (16, 9): "16:9 (Widescreen HD)",
            (4, 3): "4:3 (Standard)",
            (21, 9): "21:9 (UltraWide)",
            (32, 9): "32:9 (Super UltraWide)",
            (1, 1): "1:1 (Square)",
            (4, 5): "4:5 (Portrait)",
            (3, 4): "3:4 (Portrait)",
            (9, 16): "9:16 (Mobile)",
            (3, 2): "3:2 (Classic DSLR)",
            (2, 3): "2:3 (Portrait DSLR)",
            (5, 4): "5:4 (Medium Format)",
            (6, 5): "6:5 (Large Format)",
            (7, 5): "7:5 (Traditional Photo)",
            (11, 8): "11:8 (Academy Ratio)",
            (19, 10): "19:10 (Digital Cinema)",
        }

    def generate_resolutions(self, width: int, height: int, is_standard: bool = False) -> List[str]:
        """Generate a list of common resolutions maintaining the aspect ratio."""
        ratio = width / height
        resolutions = []
        
        # Determine if the ratio is portrait or landscape
        is_portrait = height > width
        
        # Define target widths/heights based on orientation
        if is_portrait:
            base_dimension = 'height'
            bases = [
                720, 1080, 1350, 1440, 1600, 1800, 
                1920, 2048, 2160, 2400, 2560, 2880, 
                3200, 3840, 4096
            ]
        else:
            base_dimension = 'width'
            bases = [
                720, 1080, 1280, 1440, 1600, 1920, 
                2048, 2560, 3072, 3200, 3840, 4096, 
                5120, 6016, 7680
            ]

        # Generate resolutions
        seen_resolutions = set()  # To avoid duplicates
        for base in bases:
            if is_portrait:
                height = base
                width = round(height * ratio)
            else:
                width = base
                height = round(width / ratio)

            # Skip if resulting dimension is too small or too large
            if width < 200 or height < 200:
                continue
            if width > 8192 or height > 8192:
                continue

            # Create resolution string
            resolution = f"{width}x{height}"
            
            # Only add if we haven't seen this resolution before
            if resolution not in seen_resolutions:
                seen_resolutions.add(resolution)
                resolutions.append(resolution)

        # Sort resolutions by total pixels (area)
        return sorted(resolutions, key=lambda x: int(x.split('x')[0]) * int(x.split('x')[1]))

    def get_ratio_description(self, width: int, height: int) -> str:
        """Get a description of the ratio type."""
        ratio = width / height
        if ratio == 1:
            return "Square"
        elif ratio > 1:
            if ratio >= 2.0:
                return "Super Wide"
            elif ratio >= 1.7:
                return "Ultra Wide"
            else:
                return "Landscape"
        else:
            if ratio <= 0.5:
                return "Super Tall"
            elif ratio <= 0.6:
                return "Ultra Tall"
            else:
                return "Portrait"

    def simplify_ratio(self, width: int, height: int) -> Tuple[int, int]:
        """Simplify the aspect ratio to its lowest terms."""
        gcd = self.gcd(width, height)
        return (width // gcd, height // gcd)

    def is_equivalent_ratio(self, ratio1: Tuple[int, int], ratio2: Tuple[int, int]) -> bool:
        """Check if two ratios are equivalent by comparing their decimal values."""
        decimal1 = ratio1[0] / ratio1[1]
        decimal2 = ratio2[0] / ratio2[1]
        # Allow for a small floating-point difference
        return abs(decimal1 - decimal2) < 0.0001

    def identify_ratio(self, width: int, height: int) -> Dict:
        """Identify the aspect ratio and return relevant information."""
        simplified = self.simplify_ratio(width, height)
        ratio_string = f"{simplified[0]}:{simplified[1]}"
        
        # Check if it matches a standard ratio
        is_standard = False
        name = None
        for ratio, std_name in self.standard_ratios.items():
            if self.is_equivalent_ratio(simplified, ratio):
                is_standard = True
                name = std_name
                # Use the standard ratio format for consistency
                ratio_string = f"{ratio[0]}:{ratio[1]}"
                simplified = ratio
                break

        if not name:
            ratio_type = self.get_ratio_description(width, height)
            name = f"Custom {ratio_type} Ratio ({ratio_string})"

        # Generate resolutions
        resolutions = self.generate_resolutions(simplified[0], simplified[1], is_standard)

        return {
            "ratio": ratio_string,
            "name": name,
            "is_standard": is_standard,
            "resolutions": resolutions,
            "simplified_width": simplified[0],
            "simplified_height": simplified[1]
        }

def main():
    if len(sys.argv) == 3:
        width = int(sys.argv[1])
        height = int(sys.argv[2])
    else:
        # Default test values if no arguments provided
        width, height = 16, 9

    calculator = ResolutionCalculator()
    result = calculator.identify_ratio(width, height)
    
    # Print debug information
    simplified = calculator.simplify_ratio(width, height)
    print(f"Debug Info:", file=sys.stderr)
    print(f"Input dimensions: {width}x{height}", file=sys.stderr)
    print(f"Simplified ratio: {simplified[0]}:{simplified[1]}", file=sys.stderr)
    print(f"Checking against standard ratios:", file=sys.stderr)
    for ratio, name in calculator.standard_ratios.items():
        decimal1 = simplified[0] / simplified[1]
        decimal2 = ratio[0] / ratio[1]
        print(f"  {ratio[0]}:{ratio[1]} ({name}): {decimal1:.4f} vs {decimal2:.4f}", file=sys.stderr)
    
    # Print the actual result
    print(json.dumps(result, indent=2))

if __name__ == "__main__":
    main()