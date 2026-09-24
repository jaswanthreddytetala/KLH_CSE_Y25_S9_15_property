# PROPERTY FINDER — Advanced Algorithms & Interactive Visualization Platform

## Project Overview
This project extends the original Property Finder corpus and KMP-based search logic into a modern academic demonstration website and Java algorithm library. The original source is preserved and remains runnable while additional algorithm modules for CO1–CO6 are added around it.

## Problem Statement
The challenge is to create an academic project showing how property search and advanced algorithms connect to real-world data while meeting the six course outcomes. The solution emphasizes algorithm selection, implementation, performance reasoning, and professional presentation.

## Objectives
- Preserve the existing Property Finder logic and KMP implementation.
- Add educational implementations for CO1–CO6.
- Show algorithm behavior with interactive front-end demonstrations.
- Explain time and space complexity clearly.
- Present a polished academic dashboard and presentation mode.

## Features
- Original Java property corpus search preserved.
- KMP pattern matching remains intact.
- Additional algorithms for string processing, DP, flow, approximation, randomized, and parallel topics.
- Responsive dashboard with CO sections and a presentation mode.
- Java-based extension modules for educational demos.

## Technologies
- Java 17+
- HTML5
- CSS3
- JavaScript
- Property corpus stored as text files

## Project Structure
```text
PropertyFinder/
├── corpus/
├── src/
│   ├── PropertyFinder.java
│   ├── algorithms/
│   │   ├── complexity/
│   │   ├── dp/
│   │   ├── flow/
│   │   ├── randomized/
│   │   └── string/
│   ├── api/
│   └── parallel/
├── website/
│   ├── index.html
│   ├── styles.css
│   ├── script.js
│   └── data/
├── README.md
└── .git/
```

## Original Implementation Status
The original KMP implementation in `src/PropertyFinder.java` is left intact and continues to operate on the property corpus directory.

## CO Coverage
- CO1: Problem classification and strategy selection
- CO2: KMP, Z-function, Rabin-Karp, suffix-array concepts, LCP support
- CO3: Interval DP, bitmask DP, tree DP, subset DP
- CO4: Network flow and max-flow/min-cut reasoning
- CO5: NP-completeness, reductions, approximation discussion
- CO6: Randomized and parallel algorithm demonstrations

## Install and Run
```bash
cd "DSA 3/DSA PRO/PropertyFinder"
javac src/PropertyFinder.java
java -cp src PropertyFinder
```

To view the website, open the HTML file in `website/index.html` in a browser or serve the folder:
```bash
cd "DSA 3/DSA PRO/PropertyFinder/website"
python -m http.server 8000
```
Then visit: http://localhost:8000

## Academic Presentation Notes
The website contains a presentation mode designed for professor demonstrations and showcases the six course outcomes along with the connected property-search context.

## Files Intentionally Preserved
- `src/PropertyFinder.java`
- `corpus/`
- original data and corpus structure

## Future Expansion
- Add a full REST backend service.
- Expand tests for each algorithm module.
- Add richer chart-based visualizations.
- Connect UI actions directly to Java-backed algorithm modules.

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
