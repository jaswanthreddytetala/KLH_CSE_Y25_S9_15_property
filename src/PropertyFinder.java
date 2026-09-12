import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class PropertyFinder {

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
            System.out.println("=== Property Finder: KMP Pattern Search ===");
            System.out.println("Search properties by location, price, BHK, or amenity.");
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

                searchCorpusKMP(corpusPath, pattern, scanner);
                System.out.println();
            }
        }
    }

    private static void searchCorpusKMP(Path corpusPath, String pattern, Scanner scanner) {
        String lowerPattern = pattern.toLowerCase();
        List<Path> matchingFiles = new ArrayList<>();

        try (Stream<Path> files = Files.list(corpusPath)) {
            List<Path> allPropertyFiles = files
                    .filter(Files::isRegularFile)
                    .filter(path -> path.getFileName().toString().endsWith(".txt"))
                    .sorted()
                    .collect(Collectors.toList());

            System.out.println("\n--- KMP Search Results ---");

            for (Path propertyFile : allPropertyFiles) {
                String document = Files.readString(propertyFile, StandardCharsets.UTF_8);
                int fileMatches = kmpSearch(document.toLowerCase(), lowerPattern);

                if (fileMatches > 0) {
                    matchingFiles.add(propertyFile);
                    System.out.println((matchingFiles.size()) + ". " + propertyFile.getFileName() + " (" + fileMatches + " match(es))");
                }
            }

            if (matchingFiles.isEmpty()) {
                System.out.println("No matching properties found");
            } else {
                System.out.println("Total matching properties: " + matchingFiles.size());
                System.out.println("\nYou can view any property (1-" + allPropertyFiles.size() + ")");
                System.out.print("Enter property number: ");
                String selection = scanner.nextLine().trim();
                
                if (!selection.isEmpty()) {
                    try {
                        int index = Integer.parseInt(selection) - 1;
                        if (index >= 0 && index < allPropertyFiles.size()) {
                            displayPropertyDetails(allPropertyFiles.get(index));
                        } else {
                            System.out.println("Invalid property number. Please enter a number between 1 and " + allPropertyFiles.size());
                        }
                    } catch (NumberFormatException e) {
                        System.out.println("Invalid input. Please enter a number.");
                    }
                }
            }
        } catch (IOException exception) {
            System.out.println("Unable to read the corpus: " + exception.getMessage());
        }
    }

    private static void displayPropertyDetails(Path propertyFile) {
        try {
            String content = Files.readString(propertyFile, StandardCharsets.UTF_8);
            System.out.println("\n========== PROPERTY DETAILS ==========");
            System.out.println(content);
            System.out.println("=======================================\n");
        } catch (IOException e) {
            System.out.println("Unable to read property file: " + e.getMessage());
        }
    }
}
