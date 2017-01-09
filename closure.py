def add(a,b):
	c = 1
	def cadd(d):
		g = 2
		def dadd(e):
			return a+b+c+d+e+g
		return dadd
	return cadd

e = add(1,2)(3)
print e(6)
f = add(3,4)(5)
print f(6)
