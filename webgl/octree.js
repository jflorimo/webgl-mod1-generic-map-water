var OCTREE;
(function (OCTREE)
{
	OCTREE.tree = function tree( x, y, z )
	{
		this.x = x;
		this.y = y;
		this.z = z;
	}

	OCTREE.tree.prototype.addNode = function()
	{
		console.log(this.x+", "+this.y+""+this.z);
	};
})(OCTREE || (OCTREE = {}));