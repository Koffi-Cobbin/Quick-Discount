import React from "react";
import styled from "styled-components";
import DiscountPackage from "../DiscountPackages/DiscountPackage/DiscountPackage";
import { connect } from "react-redux";


const DiscountPackages = (props) => {

    return (
        <Container>
            <Section>
                <Title>Packages </Title>
                {props.discount_packages && props.discount_packages.length > 0 ?
                <PackageGrid>
                  {props.events && props.discount_packages.map((discount_package) => (
                    <GridItem>
                        <DiscountPackage
                            key={discount_package.id}
                            id={discount_package.id}
                            type={discount_package.package_type}
                            event={props.events.find(obj => obj.url === discount_package.event)}
                            price={discount_package.price}
                            showForm={false}
                        />
                    </GridItem>
                  ))}
                </PackageGrid>
                :
                <Message>You have no discount packages.</Message>
                }
            </Section> 
        </Container>
    );
};

const Container = styled.div``;

const Section = styled.div`
    border: 1px solid rgba(0, 0, 0, 0.15);
    border-radius: 5px;
    padding: 10px;
    margin-bottom: 10px;
    position: relative;
`;

const Title = styled.h4`
    color: #fa8128;
    margin: 10px 0;
    text-align: left;
`;

const PackageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  grid-template-rows: repeat(auto-fill, minmax(280px, 1fr));
  grid-gap: 20px 10px;
  /* border: 1px solid black; */

  @media (min-width: 500px) {
    grid-auto-columns: calc(50% - 10px);
  }
  
  @media (min-width: 700px) {
    grid-auto-columns: calc(calc(100% / 3) - 20px);
    grid-gap: 30px 10px;
  }
  
  @media (min-width: 1100px) {
    grid-auto-columns: calc(25% - 30px);
  }
`;

const GridItem = styled.div`
  min-width: 250px;
  /* border: 1px solid black; */
`;

const Message = styled.div`
    text-align: center;
`;


const mapStateToProps = (state) => {
    return {
      user: state.userState.user,
      discount_packages: state.userState.discount_packages,
      events: state.eventState.events,
    }
};
  
const mapDispatchToProps = (dispatch) => ({

});

export default connect(mapStateToProps)(DiscountPackages);
