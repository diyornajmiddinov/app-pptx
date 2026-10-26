"""
The AI half of SlideAI: topic -> content JSON (checked) -> photos -> .pptx drawn by the Node engine.

    catalog.py   templates, slide plans, length limits (what the engine can draw)
    content.py   the prompt, checking the answer, asking again with the errors
    models.py    Gemini / Claude over HTTP, retries, usage accounting (ai_usage)
    images.py    photos: Pexels, or drawn by Gemini; parallel, never fails a deck
    render.py    node fill.js -> .pptx
    pipeline.py  build_presentation / switch_template: the whole thing for one job
Everything that waits on the network or on node is async, so a job's time limit really stops it.
"""
