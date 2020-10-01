const NO_CHOICE	= 0;
const SCISSORS	= 1;
const ROCK		= 2;
const PAPER		= 3;
const A_WIN		= -1;
const DRAW		= 0;
const B_WIN		= 1;
const RESULT	= {
	[NO_CHOICE]:	{
		[NO_CHOICE]:	DRAW,
		[SCISSORS]:		B_WIN,
		[ROCK]:			B_WIN,
		[PAPER]:		B_WIN
	},

	[SCISSORS]:		{
		[NO_CHOICE]:	A_WIN,
		[SCISSORS]:		DRAW,
		[ROCK]:			B_WIN,
		[PAPER]:		A_WIN
	},

	[ROCK]:			{
		[NO_CHOICE]:	A_WIN,
		[SCISSORS]:		A_WIN,
		[ROCK]:			DRAW,
		[PAPER]:		B_WIN
	},

	[PAPER]:		{
		[NO_CHOICE]:	A_WIN,
		[SCISSORS]:		B_WIN,
		[ROCK]:			A_WIN,
		[PAPER]:		DRAW
	}
};

function get_match_result(a_choice, b_choice) {
	return RESULT[a_choice][b_choice];
}

module.exports = {
	get_match_result
};