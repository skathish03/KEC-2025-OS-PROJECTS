from flask import Flask, render_template, request, jsonify
app = Flask(__name__)

@app.route('/')
def home():
    return render_template('new.html')
@app.route('/simulate', methods=['POST'])
def simulate():
    # Retrieve the simulation settings from the request
    settings = request.get_json()

    # Retrieve the settings values
    algorithm = settings['algorithm']
    frames = settings['frames']
    page_references = settings['page_references']

    # Call the respective page replacement algorithm based on the selected algorithm
    if algorithm == 'fifo':
        result = fifo(frames, page_references)
    elif algorithm == 'lru':
        result = lru(frames, page_references)
    elif algorithm == 'optimal':
        result = optimal(frames, page_references)
    else:
        return jsonify({'error': 'Invalid algorithm selected'})

    # Return the simulation result as JSON
    return jsonify(result)
# FIFO algorithm implementation
def fifo(frames, page_references):
    page_frames = []
    page_faults = 0

    for page in page_references:
        if page not in page_frames:
            page_faults += 1
            if len(page_frames) < frames:
                page_frames.append(page)
            else:
                page_frames.pop(0)
                page_frames.append(page)

    result = {
        'algorithm': 'FIFO',
        'page_faults': page_faults,
        'page_frames': page_frames
    }

    return result

# LRU algorithm implementation
def lru(frames, page_references):
    page_frames = []
    page_faults = 0

    for page in page_references:
        if page not in page_frames:
            page_faults += 1
            if len(page_frames) < frames:
                page_frames.append(page)
            else:
                page_frames.pop(0)
                page_frames.append(page)
        else:
            page_frames.remove(page)
            page_frames.append(page)

    result = {
        'algorithm': 'LRU',
        'page_faults': page_faults,
        'page_frames': page_frames
    }

    return result

# Optimal algorithm implementation
def optimal(frames, page_references):
    page_frames = []
    page_faults = 0

    for page in page_references:
        if page not in page_frames:
            page_faults += 1
            if len(page_frames) < frames:
                page_frames.append(page)
            else:
                # Find the page that will not be used for the longest duration
                future_references = page_references[page_references.index(page):]
                max_index = -1
                max_future_index = -1
                for i, frame in enumerate(page_frames):
                    if frame not in future_references:
                        max_index = i
                        break
                    else:
                        if future_references.index(frame) > max_future_index:
                            max_future_index = future_references.index(frame)
                            max_index = i
                page_frames[max_index] = page

    result = {
        'algorithm': 'Optimal',
        'page_faults': page_faults,
        'page_frames': page_frames
    }

    return result

if __name__ == '__main__':
    app.debug = True 
    app.run()