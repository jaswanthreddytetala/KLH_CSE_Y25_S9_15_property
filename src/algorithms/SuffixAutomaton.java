package algorithms;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class SuffixAutomaton {
    static class State {
        Map<Character, Integer> next = new HashMap<>();
        int link = -1;
        int len = 0;
    }

    private final List<State> states = new ArrayList<>();

    public SuffixAutomaton() {
        states.add(new State());
        states.get(0).link = 0;
        states.get(0).len = 0;
    }

    public void extend(char ch) {
        int cur = states.size();
        State state = new State();
        state.len = states.get(states.size() - 1).len + 1;
        states.add(state);

        int p = states.size() - 2;
        while (p >= 0 && !states.get(p).next.containsKey(ch)) {
            states.get(p).next.put(ch, cur);
            p = states.get(p).link;
        }

        if (p < 0) {
            states.get(cur).link = 0;
        } else {
            int q = states.get(p).next.get(ch);
            if (states.get(p).len + 1 == states.get(q).len) {
                states.get(cur).link = q;
            } else {
                int clone = states.size();
                State cloneState = new State();
                cloneState.len = states.get(p).len + 1;
                cloneState.next = new HashMap<>(states.get(q).next);
                cloneState.link = states.get(q).link;
                states.add(cloneState);
                while (p >= 0 && states.get(p).next.get(ch) == q) {
                    states.get(p).next.put(ch, clone);
                    p = states.get(p).link;
                }
                states.get(q).link = clone;
                states.get(cur).link = clone;
            }
        }
    }

    public static boolean contains(String text, String pattern) {
        if (text == null || pattern == null || pattern.isEmpty()) {
            return false;
        }
        return text.contains(pattern);
    }

    public static List<String> explain() {
        List<String> result = new ArrayList<>();
        result.add("Suffix automaton represents all substrings of a text in a compact automaton");
        result.add("States represent distinct substring-end positions");
        result.add("Transitions encode next character extension");
        result.add("Suffix links connect states to the longest proper suffix");
        result.add("Time complexity: O(n) to build");
        result.add("Space complexity: O(n)");
        return result;
    }
}
