"""The video of an animated deck: steps → moments, the copies that show them one by one."""
from app.services import video


def test_steps_starting_together_are_one_moment_and_there_are_at_most_eight():
    steps = [{"spid": 2, "effect": "fade", "delay": 100, "dur": 500}, {"spid": 3, "effect": "wipe:r", "delay": 0, "dur": 800},
             {"spid": 4, "effect": "fade", "delay": 120, "dur": 900, "span": 1500}, {"spid": 5, "effect": "flyUp", "delay": 900, "dur": 400}]
    m = video.moments(steps)
    assert [x["spids"] for x in m] == [[3, 2, 4], [5]] and m[0]["effect"] == "wipe:r"
    assert m[0]["start"] == 0 and m[0]["length"] == 1.62 and m[1]["start"] == 0.9   # the longest step of the moment (its span)
    many = [{"spid": i, "effect": "fade", "delay": i * 400, "dur": 300} for i in range(20)]
    assert len(video.moments(many)) == video.MAX_MOMENTS and sorted(i for x in video.moments(many) for i in x["spids"]) == list(range(20))
    assert video.moments([]) == []


def test_a_copy_drops_the_hidden_shapes_and_the_animation():
    xml = ('<p:sld><p:transition spd="med"><p:fade/></p:transition><p:cSld><p:spTree>'
           '<p:sp><p:nvSpPr><p:cNvPr id="2" name="a"/></p:nvSpPr></p:sp>'
           '<p:pic><p:nvPicPr><p:cNvPr id="3" name="b"/></p:nvPicPr></p:pic>'
           '<p:sp><p:nvSpPr><p:cNvPr id="4" name="c"/></p:nvSpPr></p:sp></p:spTree></p:cSld><p:timing><p:tnLst/></p:timing></p:sld>')
    out = video._without(xml, {3, 4})
    assert 'id="2"' in out and 'id="3"' not in out and 'id="4"' not in out
    assert "<p:timing>" not in out and "<p:transition" not in out
