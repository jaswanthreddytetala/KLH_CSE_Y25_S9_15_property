package api;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class PropertyApi {
    private static final Path CORPUS_PATH = Paths.get("corpus");

    public static List<PropertyRecord> listProperties() {
        List<PropertyRecord> properties = new ArrayList<>();
        if (!Files.isDirectory(CORPUS_PATH)) {
            return properties;
        }

        try (Stream<Path> files = Files.list(CORPUS_PATH)) {
            List<Path> sorted = files.filter(Files::isRegularFile)
                    .filter(path -> path.getFileName().toString().endsWith(".txt"))
                    .sorted(Comparator.comparing(path -> path.getFileName().toString()))
                    .collect(Collectors.toList());

            for (Path file : sorted) {
                String content = Files.readString(file, StandardCharsets.UTF_8);
                properties.add(parseFile(file.getFileName().toString(), content));
            }
        } catch (IOException ignored) {
        }
        return properties;
    }

    public static List<PropertyRecord> searchProperties(String pattern) {
        String query = pattern == null ? "" : pattern.trim().toLowerCase();
        if (query.isEmpty()) {
            return listProperties();
        }

        return listProperties().stream()
                .filter(p -> matches(p, query))
                .collect(Collectors.toList());
    }

    private static boolean matches(PropertyRecord property, String query) {
        return property.title.toLowerCase().contains(query)
                || property.location.toLowerCase().contains(query)
                || property.type.toLowerCase().contains(query)
                || property.description.toLowerCase().contains(query)
                || property.amenities.toLowerCase().contains(query);
    }

    private static PropertyRecord parseFile(String fileName, String content) {
        PropertyRecord record = new PropertyRecord();
        record.id = fileName.replace(".txt", "");
        record.title = extractValue(content, "Property ID");
        record.location = extractValue(content, "Location");
        record.type = extractValue(content, "Type");
        record.price = extractValue(content, "Price");
        record.bedrooms = extractValue(content, "Bedrooms");
        record.bathrooms = extractValue(content, "Bathrooms");
        record.amenities = extractValue(content, "Amenities");
        record.description = extractValue(content, "Description");
        return record;
    }

    private static String extractValue(String content, String label) {
        String prefix = label + ":";
        int start = content.indexOf(prefix);
        if (start == -1) {
            return "N/A";
        }

        start += prefix.length();
        int end = content.indexOf('\n', start);
        if (end == -1) {
            end = content.length();
        }
        return content.substring(start, end).trim();
    }

    public static class PropertyRecord {
        public String id;
        public String title;
        public String location;
        public String type;
        public String price;
        public String bedrooms;
        public String bathrooms;
        public String amenities;
        public String description;
    }
}
