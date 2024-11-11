#include <bits/stdc++.h>

using namespace std;

vector<int> findDominance(vector<string>& s) {
    int n = s.size();
    int m = 0;
    for (const auto& str : s) {
        m = max(m, (int)str.length());
    }

    // Create a vector of unordered maps to store the dominance of each prefix
    vector<unordered_map<string, int>> prefix_dominance(m);

    // Iterate through each string and update the prefix dominance
    for (const auto& str : s) {
        for (int i = 1; i <= str.length(); i++) {
            string prefix = str.substr(0, i);
            prefix_dominance[i - 1][prefix]++;
        }
    }

    // Determine the dominance of the most influential prefix for each length
    vector<int> result(m);
    for (int i = 0; i < m; i++) {
        if (!prefix_dominance[i].empty()) {
            result[i] = max_element(prefix_dominance[i].begin(), prefix_dominance[i].end(),
                [](const pair<string, int>& a, const pair<string, int>& b) {
                    return a.second < b.second;
                })->second;
        }
    }

    return result;
}

int main() {
    int n;
    cin >> n;
    vector<string> s(n);
    for (int i = 0; i < n; i++) {
        cin >> s[i];
    }

    vector<int> result = findDominance(s);

    for (int i : result) {
        cout << i << " ";
    }
    cout << endl;
    return 0;
}