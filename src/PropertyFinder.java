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

    public static void main(String[] args) {
        Path corpusPath = Paths.get("corpus");

        if (!Files.isDirectory(corpusPath)) {
            System.out.println("Corpus folder not found. Run the program from the PropertyFinder folder.");
            return;
        }

        try (Scanner scanner = new Scanner(System.in)) {
            System.out.println("=== Property Finder: Naive Pattern Search ===");
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

                searchCorpus(corpusPath, pattern);
                System.out.println();
            }
        }
    }

    private static void searchCorpus(Path corpusPath, String pattern) {
        String lowerPattern = pattern.toLowerCase();
        int matchingProperties = 0;
        int totalMatches = 0;

        try (Stream<Path> files = Files.list(corpusPath)) {
            List<Path> propertyFiles = files
                    .filter(Files::isRegularFile)
                    .filter(path -> path.getFileName().toString().endsWith(".txt"))
                    .sorted()
                    .collect(Collectors.toList());

            System.out.println("\nMatching Properties:");

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
}
