from collections import deque
import json
import random

def main():
    web = {}
    matchup_artists = []
    with open("public/web.json", "r") as outfile:
        web = json.load(outfile)
    with open("public/matchup_artists.json", "r") as outfile:
        matchup_artists = json.load(outfile)
    matchups = generate_matchups(web, 70, matchup_artists)
    write_matchups_to_disk(matchups)

def write_matchups_to_disk(matchups):
    with open("public/matchups.json", "w") as outfile:
        json.dump(matchups, outfile, indent=2)
    

def generate_matchups(m, amount, artists, with_replacement=False):
    res = []
    while len(res) < amount:
        vals = random.choices(artists, k=2)
        while not is_good_matchup(m, vals):
            vals = random.choices(artists, k=2)
        res.append((vals[0], vals[1]))
        if not with_replacement:
            artists.remove(vals[0])
            artists.remove(vals[1])
    return res

def is_good_matchup(m, matchup):
    min_deg_of_separation, max_deg_of_separation = 2, 6
    # Range of num paths for a good matchup at max_deg of sep > deg of sep > min deg of sep
    min_allowed_num_paths, max_allowed_num_paths = 8, 20
    start, end = matchup
    if start == end:
        return False
    # Ensure that destination isn't <= min degress of separation
    if len(get_valid_paths(m, start, end, min_deg_of_separation)) != 0:
        return False
    valid_paths = get_valid_paths(m, start, end, max_deg_of_separation)
    # Must be within allowed range of paths at 
    if not (max_allowed_num_paths >= len(valid_paths) >= min_allowed_num_paths):
        return False
    # Don't want all winning paths to select the same first related artist, want a better spread
    if len(set([x[0] for x in valid_paths])) == 1:
        return False
    return True

def get_valid_paths(graph, start, end, max_steps):
    # BFS path finding within <= max_steps deg of sep
    visited = set()
    queue = deque()
    queue.append((start, 0, []))
    paths = []
    
    while queue:
        node, steps, path = queue.popleft()
        if node == end and steps <= max_steps:
            paths.append(path)
        if node not in visited and steps <= max_steps:
            visited.add(node)
            for neighbor in graph.get(node, []).get('related', []):
                queue.append((neighbor, steps+1, path + [neighbor]))
    return paths

if __name__ == '__main__':
    main()