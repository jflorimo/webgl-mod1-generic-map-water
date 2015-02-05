#ifdef GL_ES
precision highp float;
#endif

varying vec2 vUV;                     // Provided by babylo
varying vec4 vColor;                 // Provided by babylo

uniform sampler2D diffuseSampler;     // Provided by babylo
uniform float time;               // This one is custom so we need to declare it to the ef

void main(void) 
{
    vec2 position = vUV;

    float color = 0.0;
    vec2 center = vec2(0.5, 0.5);

    color = sin(distance(position, center) * 10.0+ time * vColor.g);

    vec4 baseColor = texture2D(diffuseSampler, vUV);

    gl_FragColor = baseColor * vColor * vec4( vec3(color, color, color), 1.0 );
}