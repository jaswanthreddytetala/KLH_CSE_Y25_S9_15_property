import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Scanner;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class PropertyFinder {

    // Naive pattern search: compare the pattern at every possible text position.
    // The returned value is the number of occurrences in the text.
    public static int naiveSearch(String text, String pattern) {
        int matchCount = 0;
        int textLength = text.length();
        int patternLength = pattern.length();

        if (patternLength == 0 || patternLength > textLength) {
            return 0;
        }

        for (int textIndex = 0; textIndex <= textLength - patternLength; textIndex++) {
            int patternIndex = 0;

            while (patternIndex < patternLength
                    && text.charAt(textIndex + patternIndex) == pattern.charAt(patternIndex)) {
                patternIndex++;
            }

            if (patternIndex == patternLength) {
                matchCount++;
            }
        }

        return matchCount;
    }

    // KMP (Knuth-Morris-Pratt) pattern search algorithm
    // More efficient than naive search by avoiding redundant comparisons
    // Returns the number of occurrences of the pattern in the text
    public static int kmpSearch(String text, String pattern) {
        int matchCount = 0;
        int textLength = text.length();
        int patternLength = pattern.length();

        if (patternLength == 0 || patternLength > textLength) {
            return 0;
        }

        // Build the LPS (Longest Proper Prefix which is also Suffix) array
        int[] lps = buildLPSArray(pattern);

        int textIndex = 0;
        int patternIndex = 0;

        while (textIndex < textLength) {
            if (text.charAt(textIndex) == pattern.charAt(patternIndex)) {
                textIndex++;
                patternIndex++;
            }

            if (patternIndex == patternLength) {
                matchCount++;
                patternIndex = lps[patternIndex - 1];
            } else if (textIndex < textLength && text.charAt(textIndex) != pattern.charAt(patternIndex)) {
                if (patternIndex != 0) {
                    patternIndex = lps[patternIndex - 1];
                } else {
                    textIndex++;
                }
            }
        }

        return matchCount;
    }

    // Build the LPS (Longest Proper Prefix which is also Suffix) array
    // This array helps in skipping unnecessary comparisons in KMP algorithm
    private static int[] buildLPSArray(String pattern) {
        int patternLength = pattern.length();
        int[] lps = new int[patternLength];
        int length = 0;
        int index = 1;

        lps[0] = 0;

        while (index < patternLength) {
            if (pattern.charAt(index) == pattern.charAt(length)) {
                length++;
                lps[index] = length;
                index++;
            } else {
                if (length != 0) {
                    length = lps[length - 1];
                } else {
                    lps[index] = 0;
                    index++;
                }
            }
        }

        return lps;
    }

    public static void main(String[] args) {
        Path corpusPath = Paths.get("corpus");

        if (!Files.isDirectory(corpusPath)) {
            System.out.println("Corpus folder not found. Run the program from the PropertyFinder folder.");
            return;
        }

        try (Scanner scanner = new Scanner(System.in)) {
            System.out.println("=== Property Finder: Pattern Search with Naive & KMP Algorithms ===");
            System.out.println("Search property documents by location, price, BHK, or amenity.");
            System.out.println("Type 'exit' to close the program.\n");

            while (true) {
                System.out.print("Enter pattern to search: ");
                String pattern = scanner.nextLine().trim();

                if (pattern.equalsIgnoreCase("exit")) {
                    System.out.println("Thank you for using Property Finder.");
                    break;
                }

                if (pattern.isEmpty()) {
                    System.out.println("Please enter a non-empty pattern.\n");
                    continue;
                }

                System.out.println("\nSelect algorithm:");
                System.out.println("1. Naive Search");
                System.out.println("2. KMP Search");
                System.out.println("3. Both (Compare performance)");
                System.out.print("Enter your choice (1-3): ");
                
                String choice = scanner.nextLine().trim();
                
                if (choice.equals("1")) {
                    searchCorpusNaive(corpusPath, pattern);
                } else if (choice.equals("2")) {
                    searchCorpusKMP(corpusPath, pattern);
                } else if (choice.equals("3")) {
                    searchCorpusBoth(corpusPath, pattern);
                } else {
                    System.out.println("Invalid choice. Please enter 1, 2, or 3.\n");
                    continue;
                }
                
                System.out.println();
            }
        }
    }

    private static void searchCorpusNaive(Path corpusPath, String pattern) {
        String lowerPattern = pattern.toLowerCase();
        int matchingProperties = 0;
        int totalMatches = 0;

        try (Stream<Path> files = Files.list(corpusPath)) {
            List<Path> propertyFiles = files
                    .filter(Files::isRegularFile)
                    .filter(path -> path.getFileName().toString().endsWith(".txt"))
                    .sorted()
                    .collect(Collectors.toList());

            System.out.println("\n--- Naive Search Results ---");

            for (Path propertyFile : propertyFiles) {
                String document = Files.readString(propertyFile, StandardCharsets.UTF_8);
                int fileMatches = naiveSearch(document.toLowerCase(), lowerPattern);

                if (fileMatches > 0) {
                    System.out.println(propertyFile.getFileName() + " (" + fileMatches + " match(es))");
                    matchingProperties++;
                    totalMatches += fileMatches;
                }
            }

            if (matchingProperties == 0) {
                System.out.println("No matching properties found");
            } else {
                System.out.println("Total matching properties: " + matchingProperties);
                System.out.println("Total pattern matches: " + totalMatches);
            }
        } catch (IOException exception) {
            System.out.println("Unable to read the corpus: " + exception.getMessage());
        }
    }

    private static void searchCorpusKMP(Path corpusPath, String pattern) {
        String lowerPattern = pattern.toLowerCase();
        int matchingProperties = 0;
        int totalMatches = 0;

        try (Stream<Path> files = Files.list(corpusPath)) {
            List<Path> propertyFiles = files
                    .filter(Files::isRegularFile)
                    .filter(path -> path.getFileName().toString().endsWith(".txt"))
                    .sorted()
                    .collect(Collectors.toList());

            System.out.println("\n--- KMP Search Results ---");

            for (Path propertyFile : propertyFiles) {
                String document = Files.readString(propertyFile, StandardCharsets.UTF_8);
                int fileMatches = kmpSearch(document.toLowerCase(), lowerPattern);

                if (fileMatches > 0) {
                    System.out.println(propertyFile.getFileName() + " (" + fileMatches + " match(es))");
                    matchingProperties++;
                    totalMatches += fileMatches;
                }
            }

            if (matchingProperties == 0) {
                System.out.println("No matching properties found");
            } else {
                System.out.println("Total matching properties: " + matchingProperties);
                System.out.println("Total pattern matches: " + totalMatches);
            }
        } catch (IOException exception) {
            System.out.println("Unable to read the corpus: " + exception.getMessage());
        }
    }

    private static void searchCorpusBoth(Path corpusPath, String pattern) {
        String lowerPattern = pattern.toLowerCase();
        int matchingPropertiesNaive = 0;
        int totalMatchesNaive = 0;
        int matchingPropertiesKMP = 0;
        int totalMatchesKMP = 0;

        try (Stream<Path> files = Files.list(corpusPath)) {
            List<Path> propertyFiles = files
                    .filter(Files::isRegularFile)
                    .filter(path -> path.getFileName().toString().endsWith(".txt"))
                    .sorted()
                    .collect(Collectors.toList());

            // Naive Search
            long naiveStartTime = System.nanoTime();
            for (Path propertyFile : propertyFiles) {
                String document = Files.readString(propertyFile, StandardCharsets.UTF_8);
                int fileMatches = naiveSearch(document.toLowerCase(), lowerPattern);
                if (fileMatches > 0) {
                    matchingPropertiesNaive++;
                    totalMatchesNaive += fileMatches;
                }
            }
            long naiveEndTime = System.nanoTime();
            long naiveDuration = (naiveEndTime - naiveStartTime) / 1000; // Convert to microseconds

            // KMP Search
            long kmpStartTime = System.nanoTime();
            for (Path propertyFile : propertyFiles) {
                String document = Files.readString(propertyFile, StandardCharsets.UTF_8);
                int fileMatches = kmpSearch(document.toLowerCase(), lowerPattern);
                if (fileMatches > 0) {
                    matchingPropertiesKMP++;
                    totalMatchesKMP += fileMatches;
                }
            }
            long kmpEndTime = System.nanoTime();
            long kmpDuration = (kmpEndTime - kmpStartTime) / 1000; // Convert to microseconds

            System.out.println("\n--- Performance Comparison ---");
            System.out.println("Naive Search: " + matchingPropertiesNaive + " properties, " 
                    + totalMatchesNaive + " matches in " + naiveDuration + " µs");
            System.out.println("KMP Search:   " + matchingPropertiesKMP + " properties, " 
                    + totalMatchesKMP + " matches in " + kmpDuration + " µs");
            System.out.println("Speedup: " + String.format("%.2f", (double) naiveDuration / kmpDuration) + "x");

        } catch (IOException exception) {
            System.out.println("Unable to read the corpus: " + exception.getMessage());
        }
    }
}
