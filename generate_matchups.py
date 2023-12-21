from collections import deque
from datetime import datetime, timedelta
import json
import random
from collections import Counter


def main():
    web = {}
    matchup_artists = []
    with open("public/web.json", "r") as outfile:
        web = json.load(outfile)
    # get_distribution_of_degrees_of_separation(web)
    with open("public/matchup_artists.json", "r") as outfile:
        matchup_artists = json.load(outfile)
    verify_matchups(web)
    # matchups = generate_matchups(web, 70, matchup_artists)
    # write_matchups_to_disk(matchups)

def verify_matchups(web):
    with open("public/matchups.json", "r") as outfile:
        matchups = json.load(outfile)
    for date in matchups:
        matchup = matchups[date]
        start, end = matchup
        if start not in web or end not in web or not is_good_matchup(web, matchup):
            print(date, matchup)

def write_matchups_to_disk(matchups):
    start_date = datetime(2023, 11, 29)
    curr = start_date
    new_matchups = {}
    for matchup in matchups:
        date_str = curr.strftime("%m/%d/%Y")
        new_matchups[date_str] = matchup
        curr += timedelta(days=1)
    with open("public/matchups_new.json", "w") as outfile:
        json.dump(new_matchups, outfile, indent=2)
    

def generate_matchups(m, amount, artists, with_replacement=False):
    res = []
    while len(res) < amount:
        vals = random.choices(artists, k=2)
        while not is_good_matchup(m, vals):
            vals = random.choices(artists, k=2)
        res.append((vals[0], vals[1]))
        if not with_replacement:
            artists.remove(vals[1])
    return res

def is_good_matchup(m, matchup):
    min_deg_of_separation, max_deg_of_separation = 3, 7
    # Range of num paths for a good matchup at max_deg of sep > deg of sep > min deg of sep
    min_allowed_num_paths, max_allowed_num_paths = 7, 25
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
    # Don't want any single artist to be in every valid path
    all_artists_in_paths = set([x for path in valid_paths for x in path])
    for artist in all_artists_in_paths:
        if len(list(filter(lambda x: artist in x[:-1], valid_paths))) == len(valid_paths):
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

def get_connected_nodes(web, start):
    visited = set()
    result = []

    def dfs(node):
        if node not in visited:
            visited.add(node)
            if node != start:
                result.append(node)
            for neighbor in web.get(node, []).get('related', []):
                dfs(neighbor)

    dfs(start)
    return result

def get_min_path(web, start, end):
    visited = set()
    queue = deque()
    queue.append((start, 0, []))

    while queue:
        node, steps, path = queue.popleft()
        if node == end:
            return path
        if node not in visited:
            visited.add(node)
            for neighbor in web.get(node, []).get('related', []):
                queue.append((neighbor, steps+1, path + [neighbor]))
    return None


def get_distribution_of_degrees_of_separation(web):
    degrees_of_separation = {}
    for artist in web:
        end_artists = get_connected_nodes(web, artist)
        end_artist = random.sample(end_artists, k=1)
        min_path = len(get_min_path(web, artist, end_artist[0]))
        degrees_of_separation[artist] = min_path
    return Counter(sorted(degrees_of_separation.values(), reverse=True))

if __name__ == '__main__':
    main()