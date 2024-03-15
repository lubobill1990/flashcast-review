// import Star from '@/asset/star.svg';

export default function Branding() {
  return (
    <div>
      <h1 className='text-3xl font-bold mb-2'>
        <span
          style={{
            background:
              'linear-gradient(97.23deg, #64ABFF -13.26%, #4F55FF 32.28%, #E755FF 118.04%)',
            backgroundClip: 'text',
            color: 'transparent',
            display: 'inline-block',
          }}
        >
          FlashCast Reels Portal
          {/* <Star className='inline align-super ml-2'></Star> */}
        </span>
      </h1>
      <p className='text-base font-semibold mb-8'>
        Internal testing portal for reels generation and feedback collection
      </p>
    </div>
  );
}
