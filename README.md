# Property Finder - Pattern Search Based Property Search System

## PART 1 - Project Structure

```text
PropertyFinder/
├── src/
│   └── PropertyFinder.java
├── corpus/
│   ├── property1.txt
│   ├── property2.txt
│   ├── property3.txt
│   ├── property4.txt
│   └── property5.txt
└── README.md
```

The `corpus` folder is the collection of property text documents. The Java program reads these files at runtime; it does not hardcode search results.

## PART 2 - Complete Java Code

The complete source is in `src/PropertyFinder.java`.

```java
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
```

## PART 3 - Corpus Text Files

### `corpus/property1.txt`

```text
Property ID: P101
Location: Hyderabad
Type: Apartment
BHK: 2 BHK
Price: 45 Lakhs
Amenities: Parking, Lift, Security
Description: Spacious 2 BHK apartment available in Hyderabad, close to schools and offices.
```

### `corpus/property2.txt`

```text
Property ID: P102
Location: Bangalore
Type: Villa
BHK: 3 BHK
Price: 85 Lakhs
Amenities: Parking, Swimming Pool, Garden, Security
Description: Modern furnished villa in Bangalore with a private garden and swimming pool.
```

### `corpus/property3.txt`

```text
Property ID: P103
Location: Vijayawada
Type: Apartment
BHK: 2 BHK
Price: 38 Lakhs
Amenities: Lift, Security, Power Backup
Description: Affordable 2 BHK apartment in Vijayawada near the city center and public transport.
```

### `corpus/property4.txt`

```text
Property ID: P104
Location: Hyderabad
Type: Villa
BHK: 4 BHK
Price: 1.2 Crore
Amenities: Parking, Swimming Pool, Club House, Furnished Kitchen
Description: Premium furnished villa in Hyderabad with spacious rooms and a swimming pool.
```

### `corpus/property5.txt`

```text
Property ID: P105
Location: Bangalore
Type: Apartment
BHK: 3 BHK
Price: 62 Lakhs
Amenities: Parking, Gym, Lift, Security
Description: Well-connected 3 BHK apartment in Bangalore with covered parking and modern facilities.
```

## PART 4 - Ubuntu Commands

Run these commands from an Ubuntu terminal. The commands assume the project folder is created in the current directory.

```bash
mkdir -p PropertyFinder/src PropertyFinder/corpus
cd PropertyFinder
```

After placing the Java file in `src/PropertyFinder.java` and the five text files in `corpus/`, compile and run:

```bash
javac src/PropertyFinder.java
java -cp src PropertyFinder
```

To create the files from the terminal, use a text editor such as `nano`:

```bash
nano src/PropertyFinder.java
nano corpus/property1.txt
nano corpus/property2.txt
nano corpus/property3.txt
nano corpus/property4.txt
nano corpus/property5.txt
```

Paste the matching contents from PART 2 and PART 3, save with `Ctrl+O`, press `Enter`, and exit with `Ctrl+X`. Then run the compile and run commands above.

## PART 5 - Sample Output

### Search occurring in two documents

```text
Enter pattern to search: Hyderabad

Matching Properties:
property1.txt (2 match(es))
property4.txt (2 match(es))
Total matching properties: 2
Total pattern matches: 4
```

The two matches in each file come from the `Location` and `Description` lines.

### Search occurring in multiple documents

```text
Enter pattern to search: parking

Matching Properties:
property1.txt (1 match(es))
property2.txt (1 match(es))
property4.txt (1 match(es))
property5.txt (2 match(es))
Total matching properties: 4
Total pattern matches: 5
```

### Search with uppercase input

```text
Enter pattern to search: BANGALORE

Matching Properties:
property2.txt (2 match(es))
property5.txt (2 match(es))
Total matching properties: 2
Total pattern matches: 4
```

### Search with no result

```text
Enter pattern to search: beach house

Matching Properties:
No matching properties found
```

## PART 6 - How the Algorithm Works

1. The program opens the `corpus` directory using Java `Path` and `Files` APIs.
2. It selects every `.txt` property document and sorts the filenames.
3. The input pattern and document text are converted to lowercase, so the search is case-insensitive.
4. `naiveSearch` places the pattern at every possible position in the document.
5. It compares characters one by one using `charAt`.
6. If all pattern characters match, the occurrence count increases.
7. A document is displayed when its count is greater than zero.
8. The program reports both matching properties and total occurrences.

### Naive Pattern Search pseudocode

```text
naiveSearch(text, pattern):
    count = 0
    for each possible starting position in text:
        patternIndex = 0
        while characters match:
            move to the next pattern character
        if the complete pattern matched:
            count = count + 1
    return count
```

The algorithm does not use `contains`, `indexOf`, regular expressions, or another built-in pattern search method.

## PART 7 - Abstract

Property Finder is a simple Java application that searches property information stored in text documents. It treats the property files as a text corpus and applies the Naive Pattern Searching algorithm to find user-entered keywords such as locations, BHK types, prices, and amenities. The program reads every file, handles uppercase and lowercase input, displays matching filenames, counts occurrences, and reports when no property matches.

## PART 8 - Problem Statement

Real estate websites contain thousands of property records. Buyers need to find properties using information such as location, price, BHK type, property type, and amenities. This project demonstrates how a basic pattern-search algorithm can search a small property corpus efficiently enough for a learning application.

### Existing System

A manual search through many text files is slow and may miss matching properties. A basic file browser also does not count keyword occurrences or provide one combined result.

### Proposed System

The proposed system reads all property documents from a corpus folder and compares the entered pattern with each document using Naive Pattern Search. It returns matching documents and counts, without a database or external framework.

## PART 9 - Objectives

- Store realistic property information as text documents.
- Read property documents using Java file and path APIs.
- Implement Naive Pattern Searching manually.
- Search by location, BHK, price, type, or amenity.
- Support uppercase and lowercase input.
- Display matching property files and occurrence counts.
- Show a clear message when no match exists.
- Demonstrate the algorithm in a simple, understandable way.

## PART 10 - Methodology

1. **Create the corpus:** Store five property records in separate text files.
2. **Read the corpus:** Find `.txt` files in the `corpus` directory with `Files.list`.
3. **Accept input:** Ask the user for a keyword or phrase.
4. **Normalize case:** Convert both input and document text to lowercase.
5. **Search:** Call `naiveSearch` for each document.
6. **Collect results:** Count files with at least one match and sum all occurrences.
7. **Display results:** Print filenames, counts, or the no-result message.

## PART 11 - Complexity

Let $n$ be the length of one document and $m$ be the length of the pattern.

- **Time complexity for one document:** $O((n-m+1)m)$, commonly written as $O(nm)$ in the worst case.
- **Time complexity for all documents:** $O(Fnm)$ when there are $F$ documents of similar size.
- **Space complexity of the search method:** $O(1)$ extra space.
- **File storage and document reading:** The corpus itself uses disk space; the program reads one document at a time.

### Advantages

- Very easy to understand and implement.
- Uses no external libraries.
- Works with any plain-text property corpus.
- Gives occurrence counts, not just true or false.
- Useful for teaching the basic idea of pattern matching.

### Limitations

- It can be slow for very large documents and many searches.
- It does not understand synonyms, spelling errors, or meaning.
- It searches text exactly after case normalization.
- It does not rank results by relevance.

### Applications

- Searching property descriptions.
- Finding keywords in resumes or reports.
- Searching log files and configuration files.
- Basic document and email search.
- Learning the foundation of text-search systems.

### Future Scope

- Add filters for price, location, and BHK.
- Add a relevance ranking system.
- Use an indexed search algorithm for large corpora.
- Add a graphical or web interface.
- Store records in a database for larger datasets.
- Support spelling correction and related keywords.

### Conclusion

Property Finder demonstrates a complete text-corpus search workflow with standard Java. The Naive Pattern Searching algorithm is transparent and beginner-friendly, making it suitable for explaining how a search system compares a pattern with document text.

## PART 12 - PPT Content

### Slide 1: Title

- Property Finder
- Pattern Search Based Property Search System
- Java project using a property text corpus
- Presented by: Your Name

### Slide 2: Problem Statement

- Real estate data may contain thousands of property records.
- Buyers search using location, price, BHK, and amenities.
- Manual searching through many documents is time-consuming.
- We need a simple keyword search system.

### Slide 3: Objective

- Read property information from text files.
- Search the corpus using a user-entered pattern.
- Implement Naive Pattern Search manually.
- Display matching files and match counts.

### Slide 4: System / Project Workflow

- User enters a keyword.
- Program opens the corpus folder.
- Each property document is read.
- Naive search compares the pattern with the text.
- Matching properties and counts are displayed.

### Slide 5: Corpus

- The corpus contains five property text documents.
- Each document has ID, location, type, BHK, price, amenities, and description.
- Example keywords: Hyderabad, 3 BHK, parking, furnished.
- New `.txt` files can be added without changing the algorithm.

### Slide 6: Pattern Search Algorithm

- Start at the first text character.
- Compare the pattern character by character.
- Move one position when a comparison fails.
- Count a match when every pattern character matches.
- Repeat until all possible positions are checked.

### Slide 7: Implementation

- Language: Java
- APIs: `Path`, `Paths`, `Files`, `Scanner`
- Main method: `naiveSearch(text, pattern)`
- No database, framework, regex, `contains`, or `indexOf`.
- Lowercase conversion provides case-insensitive search.

### Slide 8: Sample Output

- `Hyderabad` matches property1 and property4.
- `parking` matches four property files.
- A nonexistent phrase prints `No matching properties found`.
- The program also prints occurrence totals.

### Slide 9: Advantages and Applications

- Simple and easy to explain.
- No external dependencies.
- Useful for small text collections.
- Can be applied to documents, logs, resumes, and reports.
- Shows the foundation of search engines.

### Slide 10: Conclusion

- The project connects a real-world property problem with pattern matching.
- The corpus is read dynamically from files.
- Naive Pattern Search gives transparent results.
- The project can later be extended with filters and ranking.

## PART 13 - 5-Minute Presentation Script

**Slide 1, about 20 seconds:** Good morning sir. My project is Property Finder, a pattern-search-based property search system. It is implemented in Java and searches property text documents using the Naive Pattern Searching algorithm.

**Slide 2, about 30 seconds:** Real estate systems have many property records. A buyer may want to find properties in Hyderabad, properties with parking, or a 3 BHK apartment. Searching files manually is slow, so this project provides a simple keyword search.

**Slide 3, about 25 seconds:** The objectives are to create a property corpus, read every document, search the user pattern manually, support uppercase and lowercase input, and display matching files and counts.

**Slide 4, about 30 seconds:** First, the user enters a pattern. The program opens the corpus folder and reads each text file. It converts the text and pattern to lowercase, calls the Naive Pattern Search method, and displays every document with a match.

**Slide 5, about 25 seconds:** My corpus has five text files. Each file contains a property ID, location, type, BHK, price, amenities, and description. This makes the corpus clearly related to the Property Finder problem.

**Slide 6, about 50 seconds:** In Naive Pattern Search, the pattern is aligned with the text at the first position. Characters are compared one by one. If a character does not match, the pattern moves one position to the right and comparison starts again. If all characters match, the count increases. This repeats for every possible position.

**Slide 7, about 30 seconds:** The project uses only standard Java libraries. `Files.list` finds the documents and `Files.readString` reads each file. The actual search uses loops and `charAt`; it does not use `contains`, `indexOf`, or regular expressions.

**Slide 8, about 35 seconds:** In the demonstration, Hyderabad matches two properties. Parking matches four properties. If I enter a phrase that does not occur, the system clearly prints no matching properties found. It also reports total occurrences.

**Slide 9, about 25 seconds:** The main advantage is simplicity and transparency. The same basic idea can be used for reports, logs, resumes, and other text documents. The limitation is that Naive Search can be slow for very large data.

**Slide 10, about 20 seconds:** To conclude, Property Finder demonstrates how a real-world search requirement can be solved with a text corpus and a fundamental pattern-search algorithm. In the future, filters, ranking, and an indexed algorithm can be added. Thank you.

## PART 14 - Demo Steps

1. Open an Ubuntu terminal.
2. Go to the project folder:
   ```bash
   cd PropertyFinder
   ```
3. Compile the program:
   ```bash
   javac src/PropertyFinder.java
   ```
4. Run it:
   ```bash
   java -cp src PropertyFinder
   ```
5. Enter `Hyderabad` and show `property1.txt` and `property4.txt`.
6. Enter `parking` and show the multiple matching properties.
7. Enter `beach house` and show `No matching properties found`.
8. Enter `exit` to close the program.
9. Explain that the program reads every `.txt` file and does not contain hardcoded result lists.
10. Explain that `naiveSearch` compares the pattern at every possible character position and counts complete matches.

## PART 15 - 20 Viva Questions and Answers

1. **What is Property Finder?**  It is a Java program that searches property text documents using user-entered keywords.
2. **What is the corpus?**  The corpus is the collection of five property `.txt` files.
3. **What information is stored in a document?**  ID, location, type, BHK, price, amenities, and description.
4. **What is pattern searching?**  It is finding occurrences of a smaller pattern inside larger text.
5. **Which algorithm is used?**  The Naive Pattern Searching algorithm.
6. **Why was Naive Search selected?**  It is simple, transparent, and easy to demonstrate and understand.
7. **How does the algorithm work?**  It compares the pattern with the text at every possible starting position.
8. **What happens after a mismatch?**  The pattern moves one position to the right and comparison restarts.
9. **How is a match counted?**  The count increases after all pattern characters match.
10. **Is the search case-sensitive?**  No. Both text and input are converted to lowercase.
11. **Which Java API reads files?**  `Files.readString` reads the document and `Files.list` lists corpus files.
12. **Why use `Path`?**  `Path` represents file and directory locations in a modern Java file API.
13. **Does the program use a database?**  No. It uses plain text documents as the corpus.
14. **Does it use `String.contains` or `indexOf`?**  No. The actual search is implemented with loops and `charAt`.
15. **What is the time complexity for one document?**  $O(nm)$ in the worst case, where $n$ is text length and $m$ is pattern length.
16. **What is the extra space complexity?**  $O(1)$ for the search method.
17. **What happens when there is no match?**  The program prints `No matching properties found`.
18. **Can new properties be added?**  Yes. Add another `.txt` file to the `corpus` folder.
19. **What is one limitation?**  Naive Search may be slow for a very large corpus.
20. **Where can this idea be used?**  In document search, log search, resume search, email search, and report search.
21. **What is a future improvement?**  Add filters, ranking, spelling correction, or a faster indexed algorithm.
22. **Why are filenames sorted?**  Sorting makes the output consistent and easy to demonstrate.

## PART 16 - Common Errors and Fixes

### `Corpus folder not found`

Run the program from inside the `PropertyFinder` folder:

```bash
cd PropertyFinder
java -cp src PropertyFinder
```

### `Could not find or load main class`

Compile first and keep the classpath pointing to `src`:

```bash
javac src/PropertyFinder.java
java -cp src PropertyFinder
```

### `javac: command not found`

Install the Java Development Kit on Ubuntu:

```bash
sudo apt update
sudo apt install default-jdk
```

### No properties are displayed

Check that the files are inside `PropertyFinder/corpus`, have the `.txt` extension, and contain the expected text.

### Input is not case-sensitive as expected

The source converts both the document and pattern to lowercase. Recompile after making any source changes.

### Java version issue

Check the installed version:

```bash
java -version
javac -version
```

Java 11 or newer is recommended because the program uses `Files.readString`.

## PART 17 - Final Checklist Before Presentation

- [ ] The folder is named `PropertyFinder`.
- [ ] `src/PropertyFinder.java` exists.
- [ ] All five files exist in `corpus`.
- [ ] The class name is `PropertyFinder`.
- [ ] `javac src/PropertyFinder.java` completes without errors.
- [ ] The program is run from the `PropertyFinder` folder.
- [ ] `Hyderabad` returns two properties.
- [ ] `parking` returns multiple properties.
- [ ] `beach house` returns no matches.
- [ ] The explanation of Naive Pattern Search is practiced.
- [ ] The time complexity $O(nm)$ and space complexity $O(1)$ are understood.
- [ ] Slides and the demo sequence are ready.
